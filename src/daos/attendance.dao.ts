import { Op } from 'sequelize';
import { Attendance, User, Break } from '../models';
import { AttendanceCreationAttributes } from '../models/Attendance';

class AttendanceDao {

    public async findAll() {
        return Attendance.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email', 'designation',],
                },
            ],
            order: [['date', 'DESC']],
        });
    }

    public async findOne(userId: number, date: string) {
        return Attendance.findOne({
            where: {
                userId,
                date,
            },
        });
    }

    public async create(data: AttendanceCreationAttributes) {
        return Attendance.create(data);
    }

    public async update(attendance: Attendance) {
        return attendance.save();
    }

    public async getEmployeeAttendance(employeeId: string) {
        return Attendance.findAll({
            where: {
                userId: employeeId,
            },
            include: [
                {
                    model: Break,
                    as: "breaks",
                    required: false,
                    attributes: [
                        "id",
                        "startTime",
                        "endTime",
                        "durationMinutes",
                    ],
                },
            ],
            order: [["date", "DESC"]],
        });
    }

    public async getAttendanceStatus(
        employeeId: string,
        startDate: any,
        endDate: any
    ) {
        return Attendance.findAll({
            where: {
                userId: employeeId,
                date: {
                    [Op.between]: [startDate, endDate],
                },
            },
            include: [
                {
                    model: Break,
                    as: "breaks",
                    required: false,
                    attributes: [
                        "id",
                        "startTime",
                        "endTime",
                        "durationMinutes",
                    ],
                },
            ],
            order: [["date", "DESC"]],
        });
    }
}

export default new AttendanceDao();
