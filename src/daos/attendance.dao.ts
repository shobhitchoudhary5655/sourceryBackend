import { Op } from 'sequelize';
import { Attendance, User, } from '../models';
import { AttendanceCreationAttributes } from '../models/Attendance';

class AttendanceDao {

    public async findAll() {
        return Attendance.findAll({
            include: [
                {
                    model: User,
                    as : 'user',
                    attributes: ['id', 'name', 'email', 'designation',],
                },
            ],
            order: [['date', 'DESC']],
        });
    }

    public async findOne(userId: number, date: string ) {
        return Attendance.findOne({
            where: {
                userId,
                date,
            },
        });
    }

    public async create(data: AttendanceCreationAttributes ) {
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
            order: [['date', 'DESC']],
        });
    }

    public async getAttendanceStatus(employeeId: string, startDate: any, endDate: any) {
        return Attendance.findAll({
            where: {
                userId: employeeId,
                date: {
                    [Op.between]: [startDate, endDate,],
                },
            },
        });
    }
}

export default new AttendanceDao();

// const {User,Role,Attendance} = require('../models')
// const { Op } = require('sequelize');

// const findAllAttenadance = async () => {
//     return await Attendance.findAll({
//         include: [
//             {
//                 model : User,
//                 attributes: [
//                     'id',
//                     'name',
//                     'email',
//                     'designation',
//                 ]
//             }
//         ],
//         order:[['date','DESC']]
//     })
// }

// const findOneAttendance = async (userId, date) => {
//     return await Attendance.findOne({
//         where: {
//             userId,
//             date
//         }
//     })
// }

// const createAttendance = async (data) => {
//     return await Attendance.create({
//         data
//     })
// }

// const updateAttendance = async (attendance) => {
//     return await attendance.save()
// }

// const getEmployeeAttendance = async(emplyoeeId) => {
//     return await Attendance.findAll({
//         where: {
//             userId : emplyoeeId
//         },
//         order: [['date','DESC']]
//     })
// }

// const getAttendanceStatus = async (employeeId,startDate,endDate) => {
//   return await Attendance.findAll({
//     where: {
//       userId: employeeId,
//       date:{
//         [Op.between] : [startDate,endDate]
//       }
//     }
//   })
// };


// module.exports = {
//     findAllAttenadance,
//     findOneAttendance,
//     createAttendance,
//     updateAttendance,
//     getEmployeeAttendance,
//     getAttendanceStatus
// }