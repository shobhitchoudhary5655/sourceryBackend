import cron from 'node-cron';

import {
  Attendance,
  User,
} from '../models';
import { AttendanceStatus } from '../types/attendance.types';
import {
  getTodayDate,
} from '../utils/dateHelper';

export class AttendanceStatusCron {

  public start(): void {

    cron.schedule(
      '0 16 * * *',
      async () => {
        await this.updateAttendanceStatus();
      },
      {
        timezone: 'Asia/Kolkata',
      }
    );

    console.log(
      '✅ Attendance Status Cron Started'
    );
  }

  private async updateAttendanceStatus(): Promise<void> {

    try {

      console.log(
        'Running Attendance Status Cron'
      );

      const today =
        getTodayDate();

      const users =
        await User.findAll();

      for (const user of users) {

        const attendance =
          await Attendance.findOne({
            where: {
              userId: user.id,
              date: today,
            },
          });

        if (!attendance) {

          await Attendance.create({
            userId: user.id,
            date: today,
            status: AttendanceStatus.LEAVE,
          });
        }
      }

      console.log(
        '✅ Attendance Status Updated'
      );

    } catch (error) {

      console.error(
        '❌ Attendance Cron Error',
        error
      );
    }
  }
}

// const cron = require('node-cron');
// const {Attendance,User,} = require('../models');
// const {getTodayDate,} = require('../utils/dateHelper');

// const attendanceStatusCron =
//   () => {

//     cron.schedule(
//       '0 16 * * *',
//       async () => {

//         try {

//           console.log(
//             'Running Attendance Status Cron'
//           );

//           // const today =
//           //   new Date()
//           //     .toISOString()
//           //     .split('T')[0];

//           const today = getTodayDate()

//           const users =
//             await User.findAll();

//           for (const user of users) {

//             const attendance =
//               await Attendance.findOne({
//                 where: {
//                   userId: user.id,
//                   date: today,
//                 },
//               });

//             if (!attendance) {

//               await Attendance.create({
//                 userId: user.id,
//                 date: today,
//                 status: 'leave',
//               });
//             }
//           }

//           console.log(
//             'Attendance Status Updated'
//           );

//         } catch (error) {

//           console.log(error);
//         }
//       },
//       {
//         timezone:
//           'Asia/Kolkata',
//       }
//     );
//   };

// // module.exports =
// //   attendanceStatusCron;