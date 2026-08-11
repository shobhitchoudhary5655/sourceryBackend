import User from './User';
import Role from './Role';
import Attendance from './Attendance';
import Holiday from './Holiday';
import Request from './Request';
import SalaryPayment from './Salary';
import Break from './Break';
import EmployeeDocument from './Document';
import Notification from "./Notification";
import HolidayUser from "./HolidayUser";

Role.hasMany(User, {
  foreignKey: 'roleId',
  as: 'users',
});

User.belongsTo(Role, {
  foreignKey: 'roleId',
  as: 'role',
});

User.hasMany(Attendance, {
  foreignKey: 'userId',
  as: 'attendances',
});

Attendance.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(Request, {
  foreignKey: 'userId',
  as: 'requests',
});

Request.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(SalaryPayment, {
  foreignKey: 'userId',
  as: 'salaryPayments',
});

SalaryPayment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(SalaryPayment, {
  foreignKey: 'paidBy',
  as: 'paidSalaryRecords',
});

SalaryPayment.belongsTo(User, {
  foreignKey: 'paidBy',
  as: 'paidByUser',
});

Attendance.hasMany(Break, {
  foreignKey: "attendanceId",
  as: "breaks",
});

Break.belongsTo(Attendance, {
  foreignKey: "attendanceId",
  as: "attendance",
});

EmployeeDocument.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(EmployeeDocument, {
  foreignKey: 'userId',
  as: 'documents',
});

User.hasMany(Notification, {
  foreignKey: "userId",
  as: "notifications",
});

Notification.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Holiday.hasMany(HolidayUser, {
  foreignKey: "holidayId",
  as: "employees",
});

HolidayUser.belongsTo(Holiday, {
  foreignKey: "holidayId",
  as: "holiday",
});

User.hasMany(HolidayUser, {
  foreignKey: "userId",
  as: "holidayMappings",
});

HolidayUser.belongsTo(User, {
  foreignKey: "userId",
  as: "employee",
});


export {
  User,
  Role,
  Attendance,
  Holiday,
  Request,
  SalaryPayment,
  Break,
  EmployeeDocument,
  Notification,
  HolidayUser,
};