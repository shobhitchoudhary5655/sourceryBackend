import cron from 'node-cron';
import { Op } from 'sequelize';
import { Attendance, User } from '../models';
import { AttendanceStatus } from '../types/attendance.types';
import { getYesterdayDate } from '../utils/dateHelper';
export class AttendanceStatusCron {
  public start(): void {
    cron.schedule('0 10 * * *', async () => { await this.updateAttendanceStatus(); },
      { timezone: 'Asia/Kolkata', }
    );
    console.log('✅ Attendance Status Cron Started');
  }

  private async updateAttendanceStatus(): Promise<void> {
    try {
      console.log('Running Attendance Status Cron');
      const yesterday = getYesterdayDate();
      const users = await User.findAll({
        where: {
          roleId: {
            [Op.notIn]: [1], // Excluded roles
          },
        },
      });

      for (const user of users) {
        const attendance = await Attendance.findOne({
          where: {
            userId: user.id,
            date: yesterday,
          },
        });

        if (!attendance) {
          await Attendance.create({
            userId: user.id,
            date: yesterday,
            status: AttendanceStatus.ABSENT,
          });
          console.log(`Absent marked for ${user.name}`);
        }
      }
      console.log('✅ Attendance Status Updated');
    } catch (error) {
      console.error('❌ Attendance Cron Error', error);
    }
  }
}