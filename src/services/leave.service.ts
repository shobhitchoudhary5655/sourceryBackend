import { Op } from 'sequelize';
import { v4 as uuidv4 } from "uuid";
import { User, Attendance, Holiday, Request } from '../models';
import { formatDate } from '../utils/dateHelper';
import { ApplyRequestDTO, UpdateLeaveStatusDTO } from '../dtos/leave.dto';
import { getWorkingDatesBetween, getWorkingDaysBetween, isWeeklyOff, } from '../utils/weeklyOff.helper';

class LeaveService {

    public applyRequest = async (userId: number, data: ApplyRequestDTO) => {
        // const dates = this.getDatesBetween(
        //     data.startDate,
        //     data.endDate
        // );
        const requestGroupId = uuidv4();

        const monthStart = new Date(data.startDate);
        monthStart.setDate(1);

        const monthEnd = new Date(
            monthStart.getFullYear(),
            monthStart.getMonth() + 1,
            0
        );

        const workingDates = await getWorkingDatesBetween(
            new Date(data.startDate),
            new Date(data.endDate)
        );

        const existingRequest = await Request.findOne({
            where: {
                userId,
                requestType: data.requestType,
                startDate: { [Op.in]: workingDates.map(date => formatDate(date)), },
                status: { [Op.ne]: "rejected", },
            },
        });

        if (existingRequest) {
            throw new Error("You have already applied for one or more selected dates.");
        }

        let approvedCount = await Request.count({
            where: {
                userId,
                requestType: "wfh",
                status: "approved",
                startDate: {
                    [Op.between]: [
                        formatDate(monthStart),
                        formatDate(monthEnd),
                    ],
                },
            },
        });

        const requests = [];

        for (const date of workingDates) {

            let status: "approved" | "pending" = "pending";
            let approvedBy = null;
            let approvedAt = null;

            if (
                data.requestType === "wfh" &&
                approvedCount < 1
            ) {

                status = "approved";
                approvedBy = 0;
                approvedAt = new Date();

                approvedCount++;
            }

            const request = await Request.create({
                userId,
                requestGroupId,
                requestType: data.requestType,
                leaveType: data.leaveType,
                startDate: formatDate(date),
                endDate: formatDate(date),
                reason: data.reason,
                status,
            });

            requests.push(request);
        }

        return {

            success: true,
            requests,

        };
    }

    public getMyLeaves = async (userId: number) => {
        const leaves = await Request.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
        });

        return {
            success: true,
            leaves,
        };
    };

    public getAllLeaveRequests = async (query: any) => {
        const {
            page = 1,
            limit = 10,
            search = '',
            status = '',
        } = query;

        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;
        const offset = (pageNum - 1) * limitNum;

        const where: any = {};
        if (status && status !== 'all') {
            where.status = status;
        }


        const { count, rows } = await Request.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email'],
                    where: search
                        ? {
                            name: { [Op.like]: `%${search}%` },
                        }
                        : undefined,
                },
            ],
            order: [['createdAt', 'DESC']],
            limit: limitNum,
            offset: offset,
        });

        return {
            success: true,
            requests: rows,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
        };
    };

    public updateLeaveStatus = async (id: number, data: UpdateLeaveStatusDTO) => {
        if (!['approved', 'rejected'].includes(data.status)) {
            return {
                success: false,
                message: 'Invalid status',
            };
        }

        const request = await Request.findByPk(id);

        if (!request) {
            return {
                success: false,
                message: 'Request not found',
            };
        }

        if (request.status === 'approved') {
            return {
                success: false,
                message: 'Request already approved',
            };
        }

        // Reject Request
        if (data.status === 'rejected') {
            request.status = 'rejected';
            await request.save();

            return {
                success: true,
                message: 'Request rejected successfully',
                request,
            };
        }

        // WFH Request
        if (request.requestType === 'wfh') {

            request.status = 'approved';
            await request.save();

            return {
                success: true,
                message: 'WFH approved successfully',
                request,
            };
        }

        // Leave Request
        if (request.requestType === 'leave') {

            const user = await User.findByPk(request.userId);

            if (!user) {
                return {
                    success: false,
                    message: 'User not found',
                };
            }

            let currentDate = new Date(request.startDate);
            const endDate = new Date(request.endDate);

            const leaveDays = await getWorkingDaysBetween(
                new Date(request.startDate),
                new Date(request.endDate)
            );

            if (request.leaveType === 'Casual') {
                const availableCL = Number(user.clBalance);
                if (availableCL >= leaveDays) {
                    user.clBalance = availableCL - leaveDays;
                    request.lopDays = 0;
                } else {
                    request.lopDays = leaveDays - availableCL;
                    user.clBalance = 0;
                }

            } else if (request.leaveType === 'Sick') {
                const availableSL = Number(user.slBalance);
                if (availableSL >= leaveDays) {
                    user.slBalance = availableSL - leaveDays;
                    request.lopDays = 0;
                } else {
                    request.lopDays = leaveDays - availableSL;
                    user.slBalance = 0;
                }
            }

            await user.save();
            await request.save();

            currentDate = new Date(request.startDate);

            while (currentDate <= endDate) {

                if (isWeeklyOff(currentDate)) {
                    currentDate.setDate(currentDate.getDate() + 1);
                    continue;
                }

                const formattedDate = formatDate(currentDate);

                const holiday = await Holiday.findOne({
                    where: {
                        date: formattedDate,
                    },
                });

                if (holiday) {
                    currentDate.setDate(currentDate.getDate() + 1);
                    continue;
                }

                const attendance = await Attendance.findOne({
                    where: {
                        userId: request.userId,
                        date: formattedDate,
                    },
                });

                if (!attendance) {

                    await Attendance.create({
                        userId: request.userId,
                        date: formattedDate,
                        status: 'leave',
                    });

                } else if (attendance.status === 'absent') {

                    attendance.status = 'leave';
                    await attendance.save();

                }

                currentDate.setDate(currentDate.getDate() + 1);
            }

            // Finally Approve Request
            request.status = 'approved';
            await request.save();
        }

        return {
            success: true,
            message: `Request ${data.status} successfully`,
            request,
        };
    };

    public cancelRequest = async (  userId: number,  id: number) => {
        const request = await Request.findOne({
            where: {
                id,
                userId,
            },
        });

        if (!request) {
            throw new Error("Request not found.");
        }

        if (request.status !== "pending") {
            throw new Error("Only pending requests can be cancelled.");
        }

        request.status = "cancelled";
        await request.save();

        return {
            success: true,
            message: "Request cancelled successfully.",
        };
    };
}

export default new LeaveService();