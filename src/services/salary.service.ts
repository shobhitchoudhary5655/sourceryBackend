import { Op } from 'sequelize';
import salaryDAO from '../daos/salary.dao';
import { User } from '../models';

class SalaryService {

    public getSalaryList = async (query: any) => {
        const { search = '', month, year, status = '', page = 1, limit = 10, } = query;

        return salaryDAO.getSalaryList({
            search,
            month: month ? Number(month) : undefined,
            year: year ? Number(year) : undefined,
            status,
            page: Number(page),
            limit: Number(limit),
        });
    };

    public createSalary = async (body: any) => {
        const { month, year } = body;

        if (!month || month < 1 || month > 12) {
            throw new Error("Invalid month.");
        }

        if (!year) {
            throw new Error("Invalid year.");
        }

        let generated = 0;
        let skipped = 0;

        const employees = await User.findAll({
            where: {
                roleId: {
                    [Op.ne]: 1,
                },
            },
        });

        for (const employee of employees) {
            const alreadyExists = await salaryDAO.findSalary(
                employee.id,
                month,
                year
            );

            if (alreadyExists) {
                skipped++;
                continue;
            }

            await salaryDAO.createSalary({
                userId: employee.id,
                month,
                year,
                salary: employee.salary,
                status: "Pending",
                paidDate: null,
            });

            generated++;
        }

        if (generated === 0) {
            return {
                success: true,
                message: "Salary has already been generated for all employees for the selected month.",
                generated,
                skipped,
            };
        }

        return {
            success: true,
            message: `Salary generated successfully for ${generated} employees.`,
            generated,
            skipped,
        };
    };

    public markSalaryPaid = async (id: number) => {

        const salary = await salaryDAO.findById(id);

        if (!salary) {
            return {
                success: false,
                message: 'Salary not found',
            };
        }

        if (salary.status === 'Paid') {
            return {
                success: false,
                message: 'Salary already paid.',
            };
        }

        await salaryDAO.updateSalary(salary, {
            status: 'Paid',
            paidDate: new Date(),
        });

        return {
            success: true,
            message: 'Salary marked as paid successfully.',
        };
    };

    public getSalaryDetails = async (id: number) => {
        const salary = await salaryDAO.findById(id);

        if (!salary) {
            return {
                success: false,
                message: 'Salary not found',
            };
        }

        return {
            success: true,
            data: salary,
        };
    };
}

export default new SalaryService();