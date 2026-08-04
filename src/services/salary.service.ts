import { Response } from "express";
import { Op } from 'sequelize';
import salaryDAO from '../daos/salary.dao';
import { Break, SalaryPayment } from "../models";
import { User, Request, Attendance } from '../models';
import { getWorkingDays, getWorkingDaysBetween, isWeeklyOff } from '../utils/weeklyOff.helper';
import { formatDate } from '../utils/dateHelper';
import { generateSalarySlip } from "../utils/pdf/salarySlip.generator";
import notificationService from "./notification.service";
import { calculateWorkSessionMinutes } from "../utils/workSessionHelper";

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
                    startDate: {
                        [Op.lte]: formatDate(monthEnd),
                    },
                    endDate: {
                        [Op.gte]: formatDate(monthStart),
                    },
                },
            });

            let totalLopDays = 0;
            let paidLeaveDays = 0;

            for (const leave of leaveRequests) {

                const totalLeaveDays = this.getTotalLeaveDays(
                    leave.startDate,
                    leave.endDate
                );

                const lopDays = Number(leave.lopDays || 0);

                totalLopDays += lopDays;

                paidLeaveDays += totalLeaveDays - lopDays;
            }

            const absentDays = await Attendance.count({
                where: {
                    userId: employee.id,
                    status: "absent",
                    date: {
                        [Op.between]: [
                            formatDate(monthStart),
                            formatDate(monthEnd),
                        ],
                    },
                },
            });

            const attendances = await Attendance.findAll({
                where: {
                    userId: employee.id,
                    date: {
                        [Op.between]: [
                            formatDate(monthStart),
                            formatDate(monthEnd),
                        ],
                    },
                },
            });
            let totalWorkedMinutes = 0;

            for (const attendance of attendances) {

                if (attendance.status === "leave") {
                    totalWorkedMinutes += 480;
                    continue;
                }

                if (attendance.status !== "present" && attendance.status !== "halfday") {
                    continue;
                }

                // Calculate actual worked minutes from work sessions
                let workedMinutes = 0;

                if (attendance.workSessions && attendance.workSessions.length > 0) {
                    workedMinutes = calculateWorkSessionMinutes(attendance.workSessions);
                } else {
                    workedMinutes = Math.round(Number(attendance.officeHours || 0) * 60);
                }

                // Fetch today's breaks
                const breaks = await Break.findAll({
                    where: {
                        attendanceId: attendance.id,
                    },
                });

                const totalBreakMinutes = breaks.reduce((sum, item) => sum + Number(item.durationMinutes || 0), 0);

                const FREE_LUNCH_MINUTES = Number(process.env.FREE_LUNCH_MINUTES || 30);
                const extraBreakMinutes = Math.max(0, totalBreakMinutes - FREE_LUNCH_MINUTES);

                // Deduct only extra break minutes
                workedMinutes -= extraBreakMinutes;

                if (workedMinutes < 0) {
                    workedMinutes = 0;
                }

                totalWorkedMinutes += workedMinutes;
            }

            // Keep required minutes as normal working days
            const expectedWorkingDays = workingDays - paidLeaveDays;

            const requiredMinutes = Math.max(0, expectedWorkingDays) * 8 * 60;
            let shortageMinutes =
                requiredMinutes - totalWorkedMinutes;

            const graceMinutes = Number(employee.graceBalance || 0);
            if (shortageMinutes < 0) {
                shortageMinutes = 0;
            }

            const perMinuteSalary = baseSalary / (workingDays * 8 * 60);
            let wfhDeductionDays = 0;
            let hasPendingWFH = false;

            for (const attendance of attendances) {

                if (attendance.status !== "present" && attendance.status !== "halfday"
                ) {
                    continue;
                }

                if (attendance.inOffice) {
                    continue;
                }

                // Employee worked outside office
                const requests = await Request.findAll({
                    where: {
                        userId: employee.id,
                        requestType: "wfh",
                        startDate: {
                            [Op.lte]: attendance.date,
                        },
                        endDate: {
                            [Op.gte]: attendance.date,
                        },
                        status: {
                            [Op.ne]: "cancelled",
                        },
                    },
                });

                // No WFH request
                if (requests.length === 0) {
                    wfhDeductionDays += 1;
                    continue;
                }

                for (const request of requests) {
                    switch (request.status) {
                        case "approved":
                            break;
                        case "pending":
                            hasPendingWFH = true;
                            break;
                        case "rejected":
                            wfhDeductionDays += 0.5;
                            break;
                    }
                }
            }

            if (hasPendingWFH) {
                skipped++;
                continue;
            }
            const graceUsed = Math.min(shortageMinutes, graceMinutes);
            shortageMinutes -= graceUsed;
            employee.graceBalance = graceMinutes - graceUsed;
            await employee.save();

            const officeHourDeduction = shortageMinutes * perMinuteSalary;

            const lopDeduction = totalLopDays * perDaySalary;
            const absentDeduction = absentDays * perDaySalary;
            const wfhDeduction = wfhDeductionDays * perDaySalary;

            const deductionAmount = Number(
                (
                    officeHourDeduction +
                    lopDeduction +
                    absentDeduction +
                    wfhDeduction
                ).toFixed(2)
            );

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
                workedMinutes: totalWorkedMinutes,
                requiredMinutes,
                graceUsed,
                officeHourDeduction,
                absentDays,
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

    private getTotalLeaveDays(
        startDate: string,
        endDate: string
    ): number {

        const start = new Date(startDate);
        const end = new Date(endDate);

        const diff =
            end.getTime() - start.getTime();

        return Math.floor(
            diff / (1000 * 60 * 60 * 24)
        ) + 1;
    }

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

        await notificationService.sendToUser({
            userId: salary.userId,
            title: "Salary Credited 💰",
            body: `Your salary for ${salary.month}/${salary.year} has been credited successfully.`,
            type: "SALARY",
            referenceId: salary.id,
            data: {
                salaryId: String(salary.id),
                type: "salary",
            },
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

    public async getMySalaryHistory(userId: number, month?: number, year?: number) {
        if (month && year) {
            const salary = await SalaryPayment.findOne({
                where: {
                    userId,
                    month,
                    year
                }
            });

            if (!salary) {
                throw new Error("Salary not found.");
            }
            return salary;
        }

        return await SalaryPayment.findAll({
            where: { userId },
            attributes: [
                "id",
                "month",
                "year",
                "salary",
                "status",
                "paidDate"
            ],
            order: [
                ["year", "DESC"],
                ["month", "DESC"]
            ]
        });

    }

    public async getMySalaryDetails(userId: number, salaryId: number) {
        const salary = await SalaryPayment.findOne({
            where: {
                id: salaryId,
                userId
            }
        });

        if (!salary) {
            throw new Error("Salary record not found.");
        }

        return salary;

    }

    public async downloadSalarySlip(
        userId: number,
        salaryId: number,
        res: Response
    ) {

        const salary = await SalaryPayment.findOne({
            where: {
                id: salaryId,
                userId,
            },
            include: [
                {
                    model: User,
                    as: "user",
                },
            ],
        });

        if (!salary) {
            throw new Error("Salary not found.");
        }

        await generateSalarySlip(
            salary,
            res
        );

    }
}

export default new SalaryService();