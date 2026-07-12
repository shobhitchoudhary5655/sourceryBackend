import User from './User';
import Role from './Role';
import Attendance from './Attendance';
import Holiday from './Holiday';
import Request from './Request';
import SalaryPayment from './Salary';
import Break from './Break';
import EmployeeDocument from './Document';

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

export {
  User,
  Role,
  Attendance,
  Holiday,
  Request,
  SalaryPayment,
  Break,
  EmployeeDocument,
};