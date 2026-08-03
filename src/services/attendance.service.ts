import { Op } from 'sequelize';
import { Attendance, User, Request, Holiday, Break } from '../models';
import { getTodayDate, formatDate } from '../utils/dateHelper';
import { AttendanceItem, AttendanceStatus } from '../types/attendance.types';
import { isWeeklyOff, getWeeklyOffDates, } from '../utils/weeklyOff.helper';
import { getDistance } from 'geolib';
import { getLocationName } from "../utils/locationHelper";
import notificationService from './notification.service';

class AttendanceService {

    public getTodayStatus = async (userId: number) => {
        const today = getTodayDate();
        const user = await User.findByPk(userId, {
            attributes: ["clBalance", "slBalance", "graceBalance"],
        });

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
                clBalance: user?.clBalance ?? 0,
                slBalance: user?.slBalance ?? 0,
                graceBalance: user?.graceBalance ?? 0,
            };
        }

        const leave = await Request.findOne({
            where: {
                userId,
                requestType: 'leave',
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
                clBalance: user?.clBalance ?? 0,
                slBalance: user?.slBalance ?? 0,
                graceBalance: user?.graceBalance ?? 0,
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
                clBalance: user?.clBalance ?? 0,
                slBalance: user?.slBalance ?? 0,
                graceBalance: user?.graceBalance ?? 0,
            };
        }

        return {
            success: true,
            status: 'not_marked',
            message: 'Ready For Punch In',
            clBalance: user?.clBalance ?? 0,
            slBalance: user?.slBalance ?? 0,
            graceBalance: user?.graceBalance ?? 0,
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

    public punchIn = async (userId: number, latitude: number, longitude: number) => {
        const today = getTodayDate();

        // if (isWeeklyOff(new Date(today))) {
        //     return {
        //         success: false,
        //         message: 'Today is Weekly Off',
        //     };
        // }

        if (
            latitude === undefined ||
            longitude === undefined
        ) {
            return {
                success: false,
                message: "Location is required."
            };
        }

        const OFFICE = {
            latitude: Number(process.env.OFFICE_LAT),
            longitude: Number(process.env.OFFICE_LNG),
        };

        const OFFICE_RADIUS = Number(process.env.OFFICE_RADIUS);

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

        // const approvedWFH =
        //     await Request.findOne({
        //         where: {
        //             userId,
        //             requestType: 'wfh',
        //             status: 'approved',
        //             startDate: { [Op.lte]: today, },
        //             endDate: { [Op.gte]: today, },
        //         },
        //     });

        // if (!approvedWFH) {

        //     const distance = getDistance(
        //         OFFICE,
        //         {
        //             latitude: Number(latitude),
        //             longitude: Number(longitude),
        //         }
        //     );

        //     console.log('Office:', OFFICE);
        //     console.log('User:', { latitude, longitude });
        //     console.log('Distance:', distance);
        //     console.log('Radius:', OFFICE_RADIUS);

        //     if (distance > OFFICE_RADIUS) {
        //         return {
        //             success: false,
        //             message:
        //                 "You are outside the office location."
        //         };
        //     }

        // }
        const distance = getDistance(
            OFFICE,
            {
                latitude,
                longitude,
            }
        );

        const inOffice = distance <= OFFICE_RADIUS;
        const decodedLocation =
            await getLocationName(
                latitude,
                longitude
            );

        // const attendanceStatus = approvedWFH ? 'wfh' : 'present';

        const attendance = await Attendance.create({
            userId,
            date: today,
            checkIn: new Date(),
            status: "present",
            latitude,
            longitude,
            inOffice,
            location: decodedLocation,
        } as any);

        attendance.workSessions = [
            {
                type: inOffice ? "OFFICE" : "HOME",
                startTime: new Date(),
                endTime: null,
                latitude,
                longitude,
                location: decodedLocation,
            },
        ];

        attendance.isPaused = false;

        attendance.currentWorkMode = inOffice ? "OFFICE" : "HOME";

        await attendance.save();

        await notificationService.sendToUser({
            userId,
            title: "Punch In Successful",
            body: `You have successfully punched in at ${new Date().toLocaleTimeString()}.`,
            type: "ATTENDANCE",
            referenceId: attendance.id,
        });

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

        const activeBreak = await Break.findOne({
            where: {
                attendanceId: attendance.id,
                endTime: null,
            },
        });

        if (activeBreak) {
            return {
                success: false,
                message: "Please end your break before punching out.",
            };
        }

        const now = new Date();

        if (attendance.isPaused) {
            return {
                success: false,
                message: "Please resume your work before punching out.",
            };
        }

        const sessions = [...attendance.workSessions];

        if (!sessions.length) {
            return {
                success: false,
                message: "No work session found.",
            };
        }

        const lastSession = sessions[sessions.length - 1];

        if (!lastSession.endTime) {
            lastSession.endTime = now;
        }

        attendance.workSessions = sessions;

        // Total office time (Punch In -> Punch Out)
        const grossMinutes = Math.floor((now.getTime() - attendance.checkIn!.getTime()) / (1000 * 60));

        // Fetch today's breaks
        const breaks = await Break.findAll({
            where: {
                attendanceId: attendance.id,
            },
        });

        const totalBreakMinutes = breaks.reduce(
            (sum, item) => sum + item.durationMinutes,
            0
        );

        // Company policy
        const REQUIRED_MINUTES = Number(process.env.WORKING_HOURS || 8) * 60;

        const FREE_LUNCH_MINUTES = Number(process.env.FREE_LUNCH_MINUTES || 30);

        // Actual work done
        const workingMinutes = grossMinutes - totalBreakMinutes;

        // Deduct only lunch beyond 30 minutes
        const extraBreakMinutes = Math.max(
            0,
            totalBreakMinutes - FREE_LUNCH_MINUTES
        );

        // Effective office time for attendance calculation
        const effectiveMinutes = grossMinutes - extraBreakMinutes;

        // Save attendance
        attendance.checkOut = now;

        attendance.officeHours = Number(
            (grossMinutes / 60).toFixed(2)
        );

        attendance.workingHours = Number(
            (workingMinutes / 60).toFixed(2)
        );

        attendance.effectiveHours = Number(
            (effectiveMinutes / 60).toFixed(2)
        );

        attendance.breakMinutes = totalBreakMinutes;

        // Grace calculation
        const shortage = Math.max(
            0,
            REQUIRED_MINUTES - effectiveMinutes
        );

        if (shortage === 0) {
            attendance.status = "present";
        } else {
            if (user.graceBalance >= shortage) {
                user.graceBalance -= shortage;
                attendance.status = "present";
                await user.save();
                await notificationService.sendToUser({
                    userId,
                    title: "Grace Time Used",
                    body: `${shortage} minutes have been deducted from your grace balance.`,
                    type: "ATTENDANCE",
                });
            } else {
                attendance.status = "halfday";
                await notificationService.sendToUser({
                    userId,
                    title: "Half Day Marked",
                    body: "You have been marked as Half Day because your effective working hours were insufficient.",
                    type: "ATTENDANCE",
                    referenceId: attendance.id,
                });
            }
        }

        await attendance.save();
        await notificationService.sendToUser({
            userId,
            title: "Punch Out Successful",
            body: `Working Hours : ${attendance.workingHours} hrs`,
            type: "ATTENDANCE",
            referenceId: attendance.id,
        });
        return {
            success: true,
            message: "Punch Out Successful",
            attendance,
            graceBalance: user.graceBalance,
        };
    };

    public pauseAttendance = async (userId: number) => {

        const today = getTodayDate();

        const attendance = await Attendance.findOne({
            where: {
                userId,
                date: today,
            },
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

        if (attendance.isPaused) {
            return {
                success: false,
                message: "Attendance already paused",
            };
        }

        const activeBreak = await Break.findOne({
            where: {
                attendanceId: attendance.id,
                endTime: null,
            },
        });

        if (activeBreak) {
            return {
                success: false,
                message: "Please end your break before pausing work.",
            };
        }

        const sessions = [...attendance.workSessions];

        if (!sessions.length) {
            return {
                success: false,
                message: "No active work session found.",
            };
        }

        const lastSession = sessions[sessions.length - 1];

        if (!lastSession) {
            return {
                success: false,
                message: "No work session found.",
            };
        }

        // Already paused
        if (lastSession.endTime) {
            return {
                success: false,
                message: "Current work session is already closed.",
            };
        }

        // Close current session
        lastSession.endTime = new Date().toISOString();

        attendance.workSessions = sessions;
        attendance.changed("workSessions", true);
        attendance.isPaused = true;
        await attendance.save();

        await notificationService.sendToUser({
            userId,
            title: "Work Paused",
            body: `Your work has been paused at ${new Date().toLocaleTimeString()}.`,
            type: "ATTENDANCE",
            referenceId: attendance.id,
        });

        return {
            success: true,
            message: "Attendance Paused Successfully",
            attendance,
        };
    };

    public resumeAttendance = async (
        userId: number,
        latitude: number,
        longitude: number
    ) => {

        const today = getTodayDate();

        const attendance = await Attendance.findOne({
            where: {
                userId,
                date: today,
            },
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

        if (!attendance.isPaused) {
            return {
                success: false,
                message: "Attendance is not paused",
            };
        }

        const OFFICE = {
            latitude: Number(process.env.OFFICE_LAT),
            longitude: Number(process.env.OFFICE_LNG),
        };

        const OFFICE_RADIUS = Number(process.env.OFFICE_RADIUS);

        const distance = getDistance(
            OFFICE,
            {
                latitude,
                longitude,
            }
        );

        const inOffice = distance <= OFFICE_RADIUS;

        const decodedLocation =
            await getLocationName(
                latitude,
                longitude
            );

        const sessions = [...attendance.workSessions];

        sessions.push({
            type: inOffice ? "OFFICE" : "HOME",
            startTime: new Date().toISOString(),
            endTime: null,
            latitude,
            longitude,
            location: decodedLocation,
        });

        attendance.workSessions = sessions;
        attendance.changed("workSessions", true);

        attendance.isPaused = false;

        attendance.workSessions = sessions;

        attendance.isPaused = false;

        attendance.currentWorkMode =
            inOffice
                ? "OFFICE"
                : "HOME";

        attendance.inOffice = inOffice;

        attendance.latitude = latitude;

        attendance.longitude = longitude;

        attendance.location = decodedLocation;

        await attendance.save();

        await notificationService.sendToUser({
            userId,
            title: "Work Resumed",
            body: `Your work resumed at ${new Date().toLocaleTimeString()}.`,
            type: "ATTENDANCE",
            referenceId: attendance.id,
        });

        return {
            success: true,
            message: "Attendance Resumed Successfully",
            attendance,
        };
    };

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

    public getOverallStatus = async (userId: number, month: number, year: number,) => {
        // const attendance = await Attendance.findAll({ where: { userId } });
        const startDate = new Date(year, month - 1, 1);

        const endDate = new Date(year, month, 0);
        endDate.setHours(23, 59, 59, 999);

        const attendance = await Attendance.findAll({
            where: {
                userId,
                date: {
                    [Op.between]: [startDate, endDate],
                },
            },
        });

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

        const totalAttendanceDays = present + absent + leave + wfh;

        const attendancePercentage = totalAttendanceDays > 0 ? (((present + wfh) / totalAttendanceDays) * 100).toFixed(2) : '0.00';

        return {
            success: true,
            summary: {
                present,
                absent,
                leave,
                wfh,
                totalAttendanceDays,
                attendancePercentage,
            },
        };
    };

    public startBreak = async (userId: number) => {

        const today = getTodayDate();

        const attendance = await Attendance.findOne({
            where: {
                userId,
                date: today,
            },
        });

        if (!attendance) {
            return {
                success: false,
                message: "Please punch in first.",
            };
        }

        if (attendance.checkOut) {
            return {
                success: false,
                message: "Already punched out.",
            };
        }

        const activeBreak = await Break.findOne({
            where: {
                attendanceId: attendance.id,
                endTime: null,
            },
        });

        if (activeBreak) {
            return {
                success: false,
                message: "Break already started.",
            };
        }

        const breakData = await Break.create({
            attendanceId: attendance.id,
            userId,
            startTime: new Date(),
        });
        await notificationService.sendToUser({
            userId,
            title: "Break Started",
            body: "Your break has started.",
            type: "ATTENDANCE",
        });

        return {
            success: true,
            message: "Break Started.",
            breakStartTime: breakData.startTime,
        };
    };

    public endBreak = async (userId: number) => {

        const today = getTodayDate();

        const attendance = await Attendance.findOne({
            where: {
                userId,
                date: today,
            }
        });

        if (!attendance) {
            return {
                success: false,
                message: "Attendance not found."
            };
        }

        const activeBreak = await Break.findOne({
            where: {
                attendanceId: attendance.id,
                endTime: null,
            }
        });

        if (!activeBreak) {
            return {
                success: false,
                message: "No active break."
            };
        }

        const now = new Date();

        const durationMinutes = Math.floor(
            (now.getTime() - activeBreak.startTime.getTime()) / (1000 * 60)
        );

        activeBreak.endTime = now;
        activeBreak.durationMinutes = durationMinutes;

        await activeBreak.save();
        await notificationService.sendToUser({
            userId,
            title: "Break Ended",
            body: `Break Duration : ${durationMinutes} minutes`,
            type: "ATTENDANCE",
        });
        const breaks = await Break.findAll({
            where: {
                attendanceId: attendance.id,
            },
        });

        const totalBreakMinutes = breaks.reduce(
            (sum, item) => sum + item.durationMinutes,
            0
        );

        return {
            success: true,
            message: "Break Ended.",
            totalBreakMinutes,
        };
    }

    public getBreakStatus = async (userId: number) => {

        const today = getTodayDate();

        const attendance = await Attendance.findOne({
            where: {
                userId,
                date: today,
            },
        });

        if (!attendance) {
            return {
                success: true,
                isOnBreak: false,
                breakStartTime: null,
                totalBreakMinutes: 0,
            };
        }

        const activeBreak = await Break.findOne({
            where: {
                attendanceId: attendance.id,
                endTime: null,
            },
        });

        const breaks = await Break.findAll({
            where: {
                attendanceId: attendance.id,
            },
        });

        const totalBreakMinutes = breaks.reduce(
            (sum, item) => sum + item.durationMinutes,
            0
        );

        return {
            success: true,
            isOnBreak: !!activeBreak,
            breakStartTime: activeBreak?.startTime ?? null,
            totalBreakMinutes,
        };
    };
}

export default new AttendanceService();