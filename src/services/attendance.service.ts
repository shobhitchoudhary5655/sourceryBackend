import { Op } from 'sequelize';
import { Attendance, User, Request, Holiday } from '../models';
import { getTodayDate, formatDate } from '../utils/dateHelper';
import { AttendanceItem, AttendanceStatus } from '../types/attendance.types';
import { isWeeklyOff, getWeeklyOffDates, } from '../utils/weeklyOff.helper';

class AttendanceService {

    public getTodayStatus = async (userId: number) => {
        const today = getTodayDate();

        // const dayName = new Date(today).toLocaleDateString('en-US', {
        //     weekday: 'long',
        // });

        // const weeklyOff = await WeeklyOff.findOne({ where: { dayName } });

        // if (weeklyOff) {
        //     return {
        //         success: true,
        //         status: 'week_off',
        //         message: 'Today is Weekly Off',
        //     };
        // }
        if (isWeeklyOff(new Date(today))) {
            return {
                success: true,
                status: 'week_off',
                message: 'Today is Weekly Off',
            };
        }

        const leave = await Request.findOne({
            where: {
                userId,
                status: 'approved',
                startDate: { [Op.lte]: today },
                endDate: { [Op.gte]: today },
            },
        });

        if (leave) {
            return {
                success: true,
                status: 'leave',
                message: 'You are on Leave Today',
            };
        }

        const attendance = await Attendance.findOne({
            where: { userId, date: today },
        });

        if (attendance) {
            return {
                success: true,
                status: attendance.status,
                attendance,
            };
        }

        return {
            success: true,
            status: 'not_marked',
            message: 'Ready For Punch In',
        };
    };

    public getAttendance = async () => {
        return Attendance.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email', 'designation'],
                },
            ],
            order: [['date', 'DESC']],
        });
    };

    public punchIn = async (userId: number) => {
        const today = getTodayDate();

        // if (isWeeklyOff(new Date(today))) {
        //     return {
        //         success: false,
        //         message: 'Today is Weekly Off',
        //     };
        // }

        const approvedLeave = await Request.findOne({
            where: {
                userId,
                requestType: 'leave',
                status: 'approved',
                startDate: { [Op.lte]: today, },
                endDate: { [Op.gte]: today, },
            },
        });

        if (approvedLeave) {
            return {
                success: false,
                message:
                    'You are on approved leave',
            };
        }

        // const leave = await Request.findOne({
        //     where: {
        //         userId,
        //         requestType: 'leave',
        //         status: 'approved',
        //         startDate: { [Op.lte]: today },
        //         endDate: { [Op.gte]: today },
        //     },
        // });

        // if (leave) {
        //     return { success: false, message: 'You are on Leave Today' };
        // }

        const existing = await Attendance.findOne({
            where: { userId, date: today },
        });

        if (existing) {
            return { success: false, message: 'Already Punched In Today' };
        }

        const approvedWFH =
            await Request.findOne({
                where: {
                    userId,
                    requestType: 'wfh',
                    status: 'approved',
                    startDate: { [Op.lte]: today, },
                    endDate: { [Op.gte]: today, },
                },
            });


        const attendanceStatus = approvedWFH ? 'wfh' : 'present';

        const attendance = await Attendance.create({
            userId,
            date: today,
            checkIn: new Date(),
            status: attendanceStatus,
        } as any);

        return {
            success: true,
            message: 'Punch In Successful',
            attendance,
        };
    };

    public punchOut = async (userId: number) => {
        const today = getTodayDate();

        const attendance = await Attendance.findOne({
            where: { userId, date: today },
        });

        if (!attendance) {
            return {
                success: false,
                message: "Please Punch In First",
            };
        }

        if (attendance.checkOut) {
            return {
                success: false,
                message: "Already Punched Out",
            };
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return {
                success: false,
                message: "User not found",
            };
        }

        const now = new Date();

        // Working minutes
        const workingMinutes = Math.floor((now.getTime() - attendance.checkIn!.getTime()) / (1000 * 60));

        // Working hours (for display)
        const workingHours = Number((workingMinutes / 60).toFixed(2));

        attendance.checkOut = now;
        attendance.workingHours = workingHours;

        const REQUIRED_MINUTES = 8 * 60;

        // Minutes employee is short
        const shortage = Math.max(0, REQUIRED_MINUTES - workingMinutes);

        if (shortage === 0) {
            attendance.status = "present";
        } else {
            if (user.graceBalance >= shortage) {
                user.graceBalance -= shortage;
                attendance.status = "present";

                await user.save();
            } else {
                attendance.status = "halfday";
            }
        }

        await attendance.save();

        return {
            success: true,
            message: "Punch Out Successful",
            attendance,
            graceBalance: user.graceBalance,
        };
    };

    // public punchOut = async (userId: number) => {
    //     const today = getTodayDate();

    //     const attendance = await Attendance.findOne({
    //         where: { userId, date: today },
    //     });

    //     if (!attendance) {
    //         return { success: false, message: 'Please Punch In First' };
    //     }

    //     if (attendance.checkOut) {
    //         return { success: false, message: 'Already Punched Out' };
    //     }

    //     const now = new Date();

    //     const workingHours =
    //         (now.getTime() - new Date((attendance as any).checkIn).getTime()) /
    //         (1000 * 60 * 60);

    //     attendance.checkOut = now;
    //     attendance.workingHours = Number(workingHours.toFixed(2));

    //     const hour = Number(
    //         now.toLocaleString('en-US', {
    //             timeZone: 'Asia/Kolkata',
    //             hour: '2-digit',
    //             hour12: false,
    //         })
    //     );

    //     attendance.status = hour < 14 ? 'halfday' : 'present';

    //     await attendance.save();

    //     return {
    //         success: true,
    //         message: 'Punch Out Successful',
    //         attendance,
    //     };
    // };

    public getMyAttendance = async (userId: number, month: number, year: number) => {
        const numericMonth = Number(month);
        const numericYear = Number(year);

        if (
            !Number.isInteger(numericMonth) ||
            !Number.isInteger(numericYear) ||
            numericMonth < 1 ||
            numericMonth > 12 ||
            numericYear < 2000
        ) {
            throw new Error(`Invalid month/year received. month=${month}, year=${year}`);
        }

        const startDate = new Date(numericYear, numericMonth - 1, 1);
        const endDate = new Date(numericYear, numericMonth, 0);

        const startDateString = formatDate(startDate);
        const endDateString = formatDate(endDate);

        console.log('Attendance filter:', { userId, month: numericMonth, year: numericYear, startDateString, endDateString, });

        const attendance = await Attendance.findAll({
            where: {
                userId,
                date: {
                    [Op.between]: [startDateString, endDateString],
                },
            },
        });

        const holidays = await Holiday.findAll({
            where: {
                date: {
                    [Op.between]: [startDateString, endDateString],
                },
            },
        });

        const weeklyOffDates = getWeeklyOffDates(
            numericMonth,
            numericYear
        );

        return {
            success: true,
            attendance,
            holidayDates: holidays.map((holiday) => holiday.date),
            weeklyOffDates,
        };
    };

    public getOverallStatus = async (userId: number) => {
        const attendance = await Attendance.findAll({ where: { userId } });

        let present = 0, absent = 0, leave = 0, wfh = 0;

        // attendance.forEach((item : AttendanceItem) => {
        //   if (item.status === 'present') present++;
        //   if (item.status === 'absent') absent++;
        //   if (item.status === 'leave') leave++;
        //   if (item.status === 'wfh') wfh++;
        // });
        attendance.forEach((item: any) => {
            switch (item.status) {
                case 'present':
                    present++;
                    break;

                case 'absent':
                    absent++;
                    break;

                case 'leave':
                    leave++;
                    break;

                case 'wfh':
                    wfh++;
                    break;
            }
        });

        const total = present + absent + leave + wfh;

        const percentage =
            total > 0 ? ((present + wfh) / total) * 100 : 0;

        return {
            success: true,
            summary: {
                present,
                absent,
                leave,
                wfh,
                total,
                attendancePercentage: percentage.toFixed(2),
            },
        };
    };

    // public markWeeklyOffAttendance = async () => {
    //     try {
    //         const today = new Date();

    //         const dayName = today.toLocaleDateString('en-US', {
    //             weekday: 'long',
    //         });

    //         const weeklyOff = await WeeklyOff.findOne({
    //             where: { dayName },
    //         });

    //         if (!weeklyOff) {
    //             console.log('Today is not Weekly Off');
    //             return;
    //         }

    //         const employees = await User.findAll();

    //         for (const employee of employees) {

    //             const alreadyMarked = await Attendance.findOne({
    //                 where: {
    //                     userId: employee.id,
    //                     date: today,
    //                 },
    //             });

    //             if (!alreadyMarked) {
    //                 await Attendance.create({
    //                     userId: employee.id,
    //                     date: today.toString(),
    //                     status: AttendanceStatus.WEEKLY_OFF,
    //                 });
    //             }
    //         }

    //         console.log('Weekly Off Marked Successfully');

    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
}

export default new AttendanceService();