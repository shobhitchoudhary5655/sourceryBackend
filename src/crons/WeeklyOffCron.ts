// import cron from 'node-cron';
// import { Op } from 'sequelize';
// import { AttendanceStatus } from '../types/attendance.types';
// import { User, Attendance, WeeklyOff, Leave, } from '../models';
// import { getTodayDate, } from '../utils/dateHelper';

// export class WeeklyOffCron {

//   public start(): void {

//     cron.schedule('1 0 * * *', async () => {
//       await this.markWeeklyOff();
//     },
//       { timezone: 'Asia/Kolkata', }
//     );
//     console.log('✅ Weekly Off Cron Started');
//   }

//   private async markWeeklyOff(): Promise<void> {
//     try {
//       console.log('Running Weekly Off Cron');
//       const today = getTodayDate();
//       const dayName = new Date().toLocaleDateString(
//         'en-US',
//         {
//           weekday: 'long',
//         }
//       );
//       const weeklyOff = await WeeklyOff.findOne({
//         where: {
//           dayName,
//         },
//       });

//       if (!weeklyOff) {
//         return;
//       }

//       const employees = await User.findAll();

//       for (const employee of employees) {

//         const attendance =
//           await Attendance.findOne({
//             where: {
//               userId: employee.id,
//               date: today,
//             },
//           });

//         const leave =
//           await Leave.findOne({
//             where: {
//               userId: employee.id,
//               status: 'approved',
//               startDate: {
//                 [Op.lte]: today,
//               },
//               endDate: {
//                 [Op.gte]: today,
//               },
//             },
//           });

//         if (leave) {
//           continue;
//         }

//         if (!attendance) {
//           await Attendance.create({
//             userId: employee.id,
//             date: today,
//             status: AttendanceStatus.WEEKLY_OFF,
//           });

//         }
//       }
//       console.log('✅ Weekly Off Marked Successfully');
//     } catch (error) {
//       console.error('❌ Weekly Off Error', error
//       );
//     }
//   }
// }

// // const cron = require('node-cron');
// // const { Op } = require('sequelize');

// // const {
// //   User,
// //   Attendance,
// //   WeeklyOff,
// //   Leave,
// // } = require('../models');

// // const {
// //   getTodayDate,
// // } = require('../utils/dateHelper');

// // cron.schedule('1 0 * * *', async () => {
// //   try {

// //     const today = getTodayDate();

// //     const dayName = new Date()
// //       .toLocaleDateString(
// //         'en-US',
// //         {
// //           weekday: 'long',
// //         }
// //       );

// //     const weeklyOff =
// //       await WeeklyOff.findOne({
// //         where: {
// //           dayName,
// //         },
// //       });

// //     if (!weeklyOff) {
// //       return;
// //     }

// //     const employees =
// //       await User.findAll();

// //     for (const employee of employees) {

// //       const attendance =
// //         await Attendance.findOne({
// //           where: {
// //             userId: employee.id,
// //             date: today,
// //           },
// //         });

// //       const leave =
// //         await Leave.findOne({
// //           where: {
// //             userId: employee.id,
// //             status: 'approved',
// //             startDate: {
// //               [Op.lte]: today,
// //             },
// //             endDate: {
// //               [Op.gte]: today,
// //             },
// //           },
// //         });

// //       if (leave) {
// //         continue;
// //       }

// //       if (!attendance) {

// //         await Attendance.create({
// //           userId: employee.id,
// //           date: today,
// //           status: 'week_off',
// //         });

// //       }
// //     }

// //     console.log(
// //       'Weekly Off Marked Successfully'
// //     );

// //   } catch (error) {

// //     console.log(
// //       'Weekly Off Error:',
// //       error
// //     );
// //   }
// // });