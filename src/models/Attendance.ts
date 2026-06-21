import {DataTypes,Model,Optional,} from 'sequelize';
import sequelize from '../config/database';
import {IAttendance,} from '../interfaces/attendance.interface';

export interface AttendanceCreationAttributes
  extends Optional<
    IAttendance,
    'id'
    | 'checkIn'
    | 'checkOut'
    | 'workingHours'
    | 'location'
    | 'notes'
  > {}

class Attendance
  extends Model<
    IAttendance,
    AttendanceCreationAttributes
  >
  implements IAttendance
{
  declare id: number;
  declare userId: number;
  declare date: string;
  declare checkIn?: Date;
  declare checkOut?: Date;
  declare status:
    | 'present'
    | 'absent'
    | 'halfday'
    | 'leave'
    | 'auto-punch-out'
    | 'holiday'
    | 'weekly-off'
    | 'work-from-home';

  declare workingHours: number;
  declare location?: string;
  declare notes?: string;
}

Attendance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    checkIn: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    checkOut: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        'present',
        'absent',
        'halfday',
        'leave',
        'auto-punch-out',
        'holiday',
        'weekly-off',
        'work-from-home'
      ),
      defaultValue: 'absent',
    },

    workingHours: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'attendances',
    timestamps: true,
  }
);

export default Attendance;

// const { DataTypes } = require('sequelize');

// const sequelize = require('../config/db');

// const Attendance = sequelize.define(
//   'Attendance',
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },

//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },

//     date: {
//       type: DataTypes.DATEONLY,
//       allowNull: false,
//     },

//     checkIn: {
//       type: DataTypes.DATE,
//       allowNull: true,
//     },

//     checkOut: {
//       type: DataTypes.DATE,
//       allowNull: true,
//     },

//     status: {
//       type: DataTypes.ENUM(
//         'present',
//         'absent',
//         'halfday',
//         'leave',
//         'auto-punch-out',
//         'holiday',
//         'weekly-off',
//         'work-from-home',
//       ),
//       defaultValue: 'absent',
//     },

//     workingHours: {
//       type: DataTypes.FLOAT,
//       defaultValue: 0,
//     },

//     location: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },

//     notes: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//   },
//   {
//     tableName: 'attendances',
//     timestamps: true,
//   }
// );

// module.exports = Attendance;