import { Op } from 'sequelize';
import { Holiday } from '../models';
import { getTodayDate } from '../utils/dateHelper';

class EmployeeService {
    public getUpcomingHolidays = async () => {
        const today = getTodayDate();

        const holidays = await Holiday.findAll({
            where: {
                date: {
                    [Op.gte]: today,
                },
            },
            order: [['date', 'ASC']],
            limit: 5,
        });

        return holidays;
    };
}

export default new EmployeeService()