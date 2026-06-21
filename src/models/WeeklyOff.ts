// import {
//   DataTypes,
//   Model,
//   Optional,
// } from 'sequelize';

// import sequelize from '../config/database';

// import {
//   IWeeklyOff,
// } from '../interfaces/weekly-off.interface';

// interface WeeklyOffCreationAttributes
//   extends Optional<
//     IWeeklyOff,
//     'id'
//   > {}

// class WeeklyOff
//   extends Model<
//     IWeeklyOff,
//     WeeklyOffCreationAttributes
//   >
//   implements IWeeklyOff
// {
//   declare id: number;

//   declare dayName: string;

//   declare readonly createdAt: Date;

//   declare readonly updatedAt: Date;
// }

// WeeklyOff.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },

//     dayName: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//   },
//   {
//     sequelize,
//     tableName: 'weeklyOffs',
//     timestamps: true,
//     modelName: 'WeeklyOff',
//   }
// );

// export default WeeklyOff;

// // const { DataTypes } = require('sequelize');
// // const sequelize = require('../config/db');

// // const WeeklyOff = sequelize.define(
// //     'WeeklyOff',
// //     {
// //         id: {
// //             type: DataTypes.INTEGER,
// //             primaryKey: true,
// //             autoIncrement: true,
// //         },

// //         dayName: {
// //             type: DataTypes.STRING,
// //             allowNull: false,
// //             unique: true,
// //         },
// //     },
// //     {
// //         tableName: 'weeklyOffs',
// //         timestamps: true,
// //     }
// // )

// // module.exports = WeeklyOff;