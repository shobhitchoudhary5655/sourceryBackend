import User from './User';
import Role from './Role';
import Attendance from './Attendance';
import Holiday from './Holiday';
import Request from './Request';

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

// User.hasMany(Leave, {
//   foreignKey: 'userId',
//   as: 'leaves',
// });

// Leave.belongsTo(User, {
//   foreignKey: 'userId',
//   as: 'user',
// });

// User.hasMany(WorkFromHome, {
//   foreignKey: 'userId',
//   as: 'workFromHomes',
// });

// WorkFromHome.belongsTo(User, {
//   foreignKey: 'userId',
//   as: 'user',
// });

export {
  User,
  Role,
  Attendance,
  Holiday,
  Request,
};

// const User = require('./User');
// const Role = require('./Role');
// const Attendance = require('./Attendance');
// const WeeklyOff = require('./WeeklyOff');
// const Holiday = require('./Holiday')
// const Leave = require('./Leave')
// const WorkFromHome = require('./WorkFromHome')

// Role.hasMany(User, {
//   foreignKey: 'roleId',
// });

// User.belongsTo(Role, {
//   foreignKey: 'roleId',
// });

// User.hasMany(Attendance, {
//   foreignKey: 'userId',
// });

// Attendance.belongsTo(User, {
//   foreignKey: 'userId',
// });

// User.hasMany(Leave, {
//   foreignKey: 'userId',
// })

// Leave.belongsTo(User, {
//   foreignKey: 'userId'
// })

// User.hasMany(WorkFromHome, {
//   foreignKey: 'userId'
// })

// WorkFromHome.belongsTo(User, {
//   foreignKey: 'userId'
// })

// // module.exports = {
// //   User,
// //   Role,
// //   Attendance,
// //   Holiday,
// //   WeeklyOff,
// //   Leave,
// //   WorkFromHome,
// // };

// export {
//   User,
//   Role,
//   Attendance,
//   Holiday,
//   WeeklyOff,
//   Leave,
//   WorkFromHome,
// };