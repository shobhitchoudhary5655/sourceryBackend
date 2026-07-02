import { Op } from 'sequelize';
import salaryDAO from '../daos/salary.dao';
import { User, Request, Attendance } from '../models';
import { getWorkingDays, getWorkingDaysBetween, isWeeklyOff } from '../utils/weeklyOff.helper';
import { formatDate } from '../utils/dateHelper';

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
            where: { roleId: { [Op.ne]: 1, }, },
        });

        const monthStart = new Date(year, month - 1, 1);
        const monthEnd = new Date(year, month, 0);
        const workingDays = getWorkingDays(month, year);

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

            if (employee.salary == null) {
                skipped++;
                continue;
            }

            const baseSalary = Number(employee.salary);
            const perDaySalary = baseSalary / workingDays;

            const leaveRequests = await Request.findAll({
                where: {
                    userId: employee.id,
                    requestType: "leave",
                    status: "approved",
                    startDate: { [Op.lte]: monthEnd, },
                    endDate: { [Op.gte]: monthStart, },
                },
            });

            let totalLopDays = 0;

            for (const leave of leaveRequests) {
                totalLopDays += Number(leave.lopDays || 0);
            }

            const rejectedWFHRequests = await Request.findAll({
                where: {
                    userId: employee.id,
                    requestType: "wfh",
                    status: "rejected",
                    startDate: { [Op.lte]: monthEnd, },
                    endDate: { [Op.gte]: monthStart, },
                },
            });

            let wfhDeductionDays = 0;

            for (const request of rejectedWFHRequests) {

                const effectiveStart = new Date(Math.max(new Date(request.startDate).getTime(), monthStart.getTime()));

                const effectiveEnd = new Date(Math.min(new Date(request.endDate).getTime(), monthEnd.getTime())
                );

                const workingDays = await getWorkingDaysBetween(
                    effectiveStart,
                    effectiveEnd
                );

                wfhDeductionDays += workingDays * 0.5;
            }

            const absentDays = await Attendance.count({
                where: {
                    userId: employee.id,
                    status: "absent",
                    date: {
                        [Op.between]: [formatDate(monthStart), formatDate(monthEnd)]
                    }
                }
            });

            const totalDeductionDays = totalLopDays + wfhDeductionDays + absentDays;
            const deductionAmount = Number((totalDeductionDays * perDaySalary).toFixed(2));

            const finalSalary = Number(Math.max(0, baseSalary - deductionAmount).toFixed(2));

            await salaryDAO.createSalary({
                userId: employee.id,
                month,
                year,
                baseSalary,
                lopDays: totalLopDays,
                wfhDeductionDays,
                deductionAmount,
                salary: finalSalary,
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