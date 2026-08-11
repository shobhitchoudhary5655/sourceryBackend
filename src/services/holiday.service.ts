import { Holiday, HolidayUser, User } from "../models";
import notificationService from "./notification.service";
import { CreateHolidayDto } from '../dtos/holiday.dto';

class HolidayService {

    public getHolidays = async () => {
        // const holidays = await Holiday.findAll({
        //     order: [['date', 'ASC']],
        // });
        const holidays = await Holiday.findAll({
            include: [
                {
                    model: HolidayUser,
                    as: "employees",
                    include: [{
                        model: User,
                        as: "employee",
                        attributes: ["id", "name", "email",],
                    },],
                },
            ],
            order: [["date", "ASC"]],
        });

        return {
            success: true,
            holidays,
        };
    };

    public addHoliday = async (userId: number, data: CreateHolidayDto) => {
        console.log(userId,data)
        // Only check duplicate PUBLIC holiday
        if (data.holidayType === "PUBLIC") {

            const exists = await Holiday.findOne({
                where: {
                    date: data.date,
                    holidayType: "PUBLIC",
                },
            });

            if (exists) {
                throw new Error("Public holiday already exists on this date.");
            }

        }

        // 2. Create holiday
        const holiday = await Holiday.create({
            holidayName: data.holidayName,
            date: data.date,
            holidayType: data.holidayType,
            description: data.description,
            createdBy: userId,
        });
console.log(holiday)
        // 3. Public holiday
        if (data.holidayType === "PUBLIC") {
            return {
                success: true,
                holiday,
            };

        }

        // 4. Validate employees
        if (!data.employeeIds || data.employeeIds.length === 0) {
            throw new Error("Please select employees.");
        }
        const alreadyAssigned = await HolidayUser.findAll({
            where: {
                userId: data.employeeIds,
            },
            include: [
                {
                    model: Holiday,
                    as: "holiday",
                    where: {
                        date: data.date,
                        holidayType: data.holidayType,
                    },
                },
                {
                    model: User,
                    as: "employee",
                    attributes: ["id", "name"],
                },
            ],
        });

    console.log(alreadyAssigned);
    

        if (alreadyAssigned.length > 0) {

            const employeeNames = alreadyAssigned.map(
                (item: any) => item.employee.name
            );

            throw new Error(
                `Holiday already assigned to ${employeeNames.join(", ")}`
            );

        }
        // 5. Create employee mapping
        await HolidayUser.bulkCreate(
            data.employeeIds.map(employeeId => ({
                holidayId: holiday.id,
                userId: employeeId,
            }))
        );

        // 6. Send notification
        for (const employeeId of data.employeeIds) {
            await notificationService.sendToUser({
                userId: employeeId,
                title: data.holidayType === "SPECIAL_WFH"
                    ? "Work From Home Assigned"
                    : "Holiday Assigned",
                body: `${data.holidayName} has been assigned.`,
                type: "HOLIDAY",
                referenceId: holiday.id,
                data: { holidayId: String(holiday.id), },
            });
        }

        return {
            success: true,
            holiday,
        };
    };

    public deleteHoliday = async (id: string) => {
        const holiday = await Holiday.findByPk(id);

        if (!holiday) {
            return {
                success: false,
                message: 'Holiday not found',
            };
        }

        await holiday.destroy();

        return {
            success: true,
            message: 'Holiday deleted successfully',
        };
    };

    public getHolidayForEmployee = async (userId: number, date: string) => {
        const publicHoliday = await Holiday.findOne({
            where: {
                date,
                holidayType: "PUBLIC",
            },
        });

        if (publicHoliday) {
            return publicHoliday;
        }

        const specialHoliday = await Holiday.findOne({
            where: {
                date,
                holidayType: ["SPECIAL_HOLIDAY", "SPECIAL_WFH",],
            },
            include: [{
                model: HolidayUser,
                as: "employees",
                where: { userId, },
                required: true,
            },],
        });

        return specialHoliday;
    };
}

export default new HolidayService();