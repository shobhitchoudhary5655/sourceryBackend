import { DataTypes, Model, Optional, } from 'sequelize';
import sequelize from '../config/database';
import { IAttendance, } from '../interfaces/attendance.interface';

export interface AttendanceCreationAttributes
  extends Optional<
    IAttendance,
    'id'
    | 'checkIn'
    | 'checkOut'
    | 'officeHours'
    | 'workingHours'
    | 'effectiveHours'
    | 'breakMinutes'
    | 'location'
    | 'notes'
    | 'latitude'
    | 'longitude'
    | 'inOffice'
  > { }

class Attendance
  extends Model<
    IAttendance,
    AttendanceCreationAttributes
  >
  implements IAttendance {
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
    | 'birthday-leave'
    | 'auto-punch-out'
    | 'holiday'
    | 'weekly-off'
    | 'work-from-home';

  declare officeHours: number;
  declare workingHours: number;
  declare effectiveHours: number;
  declare breakMinutes: number;
  declare location?: string;
  declare notes?: string;
  declare latitude: number;
  declare longitude: number;
  declare inOffice: boolean;
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
        'birthday-leave',
        'auto-punch-out',
        'holiday',
        'weekly-off',
        'work-from-home'
      ),
      defaultValue: 'absent',
    },

    officeHours: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    workingHours: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    effectiveHours: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    breakMinutes: {
      type: DataTypes.INTEGER,
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
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },

    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },

    inOffice: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'attendances',
    timestamps: true,
  }
);

export default Attendance;