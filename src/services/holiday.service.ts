import { Holiday } from '../models';
import { CreateHolidayDto } from '../dtos/holiday.dto';

class HolidayService {

    public getHolidays = async () => {
        const holidays = await Holiday.findAll({
            order: [['date', 'ASC']],
        });

        return {
            success: true,
            holidays,
        };
    };

    public addHoliday = async (data: CreateHolidayDto) => {
        const holiday = await Holiday.create({
            holidayName: data.holidayName,
            date: data.date,
        });

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
}

export default new HolidayService();