import { DataTypes, Model, Optional, } from 'sequelize';
import sequelize from '../config/database';
import { IUser, } from '../interfaces/user.interface';

export interface UserCreationAttributes
  extends Optional<
    IUser,
    | 'id'
    | 'employeeId'
    | 'phone'
    | 'gender'
    | 'dateOfBirth'
    | 'designation'
    | 'joiningDate'
    | 'workLocation'
    | 'employeeType'
    | 'profileImage'
    | 'salary'
    | 'status'
    | 'clBalance'
    | 'slBalance'
  > { }

class User
  extends Model<
    IUser,
    UserCreationAttributes
  >
  implements IUser {
  declare id: number;

  declare employeeId?: string;

  declare name: string;

  declare email: string;

  declare password: string;

  declare roleId: number;

  declare phone?: string;

  declare gender?:
    | 'Male'
    | 'Female'
    | 'Other';

  declare dateOfBirth?: string;

  declare designation?: string;

  declare joiningDate?: string;

  declare workLocation?: string;

  declare employeeType?:
    | 'Permanent'
    | 'Contract'
    | 'Intern';

  declare profileImage?: string;

  declare salary?: number | null;

  declare status: "Active" | "Inactive";

  declare clBalance?: number | null;

  declare slBalance?: number | null;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    employeeId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    gender: {
      type: DataTypes.ENUM(
        'Male',
        'Female',
        'Other'
      ),
      allowNull: true,
    },

    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    designation: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    joiningDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    workLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    employeeType: {
      type: DataTypes.ENUM(
        'Permanent',
        'Contract',
        'Intern'
      ),
      allowNull: true,
    },

    profileImage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: null,
    },

    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: false,
      defaultValue: "Active",
    },

    clBalance: {
      type: DataTypes.DECIMAL(4, 1),
      allowNull: false,
      defaultValue: 0,
    },

    slBalance: {
      type: DataTypes.DECIMAL(4, 1),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    modelName: 'User',
  }
);

export default User;