import { Op } from 'sequelize';
import { Attendance, User, Request, Holiday } from '../models';
import { getTodayDate, formatDate } from '../utils/dateHelper';
import { AttendanceItem, AttendanceStatus } from '../types/attendance.types';
import { isWeeklyOff, getWeeklyOffDates, } from '../utils/weeklyOff.helper';
import { getDistance } from 'geolib';
import { getLocationName } from "../utils/locationHelper";

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

        console.log("Office Latitude :", OFFICE.latitude);
        console.log("Office Longitude:", OFFICE.longitude);

        console.log("Employee Latitude :", latitude);
        console.log("Employee Longitude:", longitude);

        console.log("Distance:", distance);

        console.log("Office Radius:", OFFICE_RADIUS);

        console.log("In Office:", inOffice);

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

}

export default new AttendanceService();