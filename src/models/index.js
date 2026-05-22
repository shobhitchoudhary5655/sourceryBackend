const User = require('./User');

const Role = require('./Role');

const Attendance = require('./Attendance');

Role.hasMany(User, {
  foreignKey: 'roleId',
});

User.belongsTo(Role, {
  foreignKey: 'roleId',
});

User.hasMany(Attendance, {
  foreignKey: 'userId',
});

Attendance.belongsTo(User, {
  foreignKey: 'userId',
});

module.exports = {
  User,
  Role,
  Attendance,
};