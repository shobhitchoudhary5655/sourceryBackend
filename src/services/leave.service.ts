import { Op } from 'sequelize';
import { User, Attendance, Holiday, Request } from '../models';
import { formatDate } from '../utils/dateHelper';
import { ApplyRequestDTO, UpdateLeaveStatusDTO } from '../dtos/leave.dto';
import { isWeeklyOff, } from '../utils/weeklyOff.helper';

class LeaveService {

    // public applyLeave = async (userId: number, data: ApplyLeaveDTO) => {
    //     // const leave = await Leave.create({
    //     //     userId,
    //     //     ...data,
    //     // } as any);
    //     const leave = await Request.create({
    //         userId,
    //         requestType: 'leave',
    //         leaveType,
    //         startDate,
    //         endDate,
    //         reason,
    //     });

    //     const wfh = await Request.create({
    //         userId,
    //         requestType: 'wfh',
    //         startDate,
    //         endDate,
    //         reason,
    //     });

    //     return {
    //         success: true,
    //         message: 'Leave request submitted successfully',
    //         leave,
    //     };
    // };

    public applyRequest = async (
        userId: number,
        data: ApplyRequestDTO
    ) => {

        const request = await Request.create({
            userId,
            requestType: data.requestType,
            leaveType: data.leaveType,
            startDate: data.startDate,
            endDate: data.endDate,
            reason: data.reason,
        });

        return {
            success: true,
            request,
        };
    };

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

        // const offset = (page - 1) * limit;

        const where: any = {};
        if (status && status !== 'all') {
            where.status = status;
        }

        // const { count, rows } = await Leave.findAndCountAll({
        //     where,
        //     include: [
        //         {
        //             model: User,
        //              as : 'user',
        //             attributes: ['id', 'name', 'email'],
        //             where: search
        //                 ? {
        //                     name: { [Op.like]: `%${search}%` },
        //                 }
        //                 : undefined,
        //         },
        //     ],
        //     order: [['createdAt', 'DESC']],
        //     limit: Number(limit),
        //     offset: Number(offset),
        // });

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

    // public updateLeaveStatus = async (id: number, data: UpdateLeaveStatusDTO) => {
    //     if (!['approved', 'rejected'].includes(data.status)) {
    //         return {
    //             success: false,
    //             message: 'Invalid status',
    //         };
    //     }

    //     const leave = await Request.findByPk(id);

    //     if (!leave) {
    //         return {
    //             success: false,
    //             message: 'Leave not found',
    //         };
    //     }

    //     if (leave.status === 'approved') {
    //         return {
    //             success: false,
    //             message: 'Leave already approved',
    //         };
    //     }

    //     leave.status = data.status;
    //     await leave.save();

    //     if (data.status === 'approved') {
    //         let currentDate = new Date(leave.startDate);
    //         const endDate = new Date(leave.endDate);

    //         // while (currentDate <= endDate) {

    //         //     const dayName = currentDate.toLocaleDateString('en-US', {
    //         //         weekday: 'long',
    //         //         timeZone: 'Asia/Kolkata',
    //         //     });

    //         //     if (isWeeklyOff(currentDate)) {
    //         //         currentDate.setDate(
    //         //             currentDate.getDate() + 1
    //         //         );

    //         //         continue;
    //         //     }

    //         //     const formattedDate = formatDate(currentDate);

    //         //     const holiday = await Holiday.findOne({
    //         //         where: { date: formattedDate },
    //         //     });

    //         //     if (holiday) {
    //         //         currentDate.setDate(currentDate.getDate() + 1);
    //         //         continue;
    //         //     }

    //         //     const attendance = await Attendance.findOne({
    //         //         where: {
    //         //             userId: leave.userId,
    //         //             date: formattedDate,
    //         //         },
    //         //     });

    //         //     if (!attendance) {
    //         //         await Attendance.create({
    //         //             userId: leave.userId,
    //         //             date: formattedDate,
    //         //             status: 'leave',
    //         //         });
    //         //     } else {
    //         //         attendance.status = 'leave';
    //         //         await attendance.save();
    //         //     }

    //         //     currentDate.setDate(currentDate.getDate() + 1);
    //         // }
    //         while (currentDate <= endDate) {

    //             if (isWeeklyOff(currentDate)) {
    //                 currentDate.setDate(
    //                     currentDate.getDate() + 1
    //                 );
    //                 continue;
    //             }

    //             const formattedDate = formatDate(currentDate);

    //             const holiday = await Holiday.findOne({
    //                 where: {
    //                     date: formattedDate,
    //                 },
    //             });

    //             if (holiday) {
    //                 currentDate.setDate(
    //                     currentDate.getDate() + 1
    //                 );
    //                 continue;
    //             }

    //             const attendance = await Attendance.findOne({
    //                 where: {
    //                     userId: leave.userId,
    //                     date: formattedDate,
    //                 },
    //             });

    //             if (!attendance) {
    //                 await Attendance.create({
    //                     userId: leave.userId,
    //                     date: formattedDate,
    //                     status: 'leave',
    //                 });
    //             } else if (attendance.status === 'absent') {
    //                 attendance.status = 'leave';
    //                 await attendance.save();
    //             }

    //             currentDate.setDate(
    //                 currentDate.getDate() + 1
    //             );
    //         }
    //     }

    //     return {
    //         success: true,
    //         message: `Leave ${data.status} successfully`,
    //         leave,
    //     };
    // };

    public updateLeaveStatus = async (  id: number,  data: UpdateLeaveStatusDTO ) => {
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

        request.status = data.status;
        await request.save();

        // WFH Request
        if (request.requestType === 'wfh') {
            return {
                success: true,
                message: `WFH ${data.status} successfully`,
                request,
            };
        }

        // Leave Request
        if (
            request.requestType === 'leave' &&
            data.status === 'approved'
        ) {

            let currentDate =
                new Date(request.startDate);

            const endDate =
                new Date(request.endDate);

            while (currentDate <= endDate) {

                if (isWeeklyOff(currentDate)) {
                    currentDate.setDate(
                        currentDate.getDate() + 1
                    );
                    continue;
                }

                const formattedDate =
                    formatDate(currentDate);

                const holiday =
                    await Holiday.findOne({
                        where: {
                            date: formattedDate,
                        },
                    });

                if (holiday) {
                    currentDate.setDate(
                        currentDate.getDate() + 1
                    );
                    continue;
                }

                const attendance =
                    await Attendance.findOne({
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

                } else if (
                    attendance.status === 'absent'
                ) {

                    attendance.status = 'leave';
                    await attendance.save();
                }

                currentDate.setDate(
                    currentDate.getDate() + 1
                );
            }
        }

        return {
            success: true,
            message: `Request ${data.status} successfully`,
            request,
        };
    };
}

export default new LeaveService();