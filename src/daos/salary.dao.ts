import { Op } from 'sequelize';
import SalaryPayment from '../models/Salary';
import User from '../models/User';

class SalaryDAO {

    public async getSalaryList(filters: { search?: string; month?: number; year?: number; status?: string; page?: number; limit?: number; }) {
        const { search = '', month, year, status, page = 1, limit = 10, } = filters;
        const offset = (page - 1) * limit;
        const salaryWhere: any = {};
        const userWhere: any = {};

        if (month) {
            salaryWhere.month = month;
        }

        if (year) {
            salaryWhere.year = year;
        }

        if (status) {
            salaryWhere.status = status;
        }

        if (search) {
            userWhere[Op.or] = [
                {
                    name: {
                        [Op.like]: `%${search}%`,
                    },
                },
                {
                    employeeId: {
                        [Op.like]: `%${search}%`,
                    },
                },
            ];
        }

        const { rows, count } = await SalaryPayment.findAndCountAll({
            where: salaryWhere,
            include: [
                {
                    model: User,
                    as: 'user',
                    where: userWhere,
                    attributes: ['id', 'employeeId', 'name', 'designation',],
                },
            ],
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });

        return {
            salaries: rows,
            total: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
        };
    }

    public async findSalary(userId: number, month: number, year: number) {
        return SalaryPayment.findOne({
            where: { userId, month, year, },
        });
    }

    public async createSalary(data: any) {
        return SalaryPayment.create(data);
    }

    public async updateSalary(salary: SalaryPayment, data: any) {
        return salary.update(data);
    }

    public async findById(id: number) {
        return SalaryPayment.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'user',
                },
            ],
        });
    }
}

export default new SalaryDAO();