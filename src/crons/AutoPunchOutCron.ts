import cron from 'node-cron';

import { Attendance } from '../models';
import { Op } from 'sequelize';
import {
    getTodayDate,
} from '../utils/dateHelper';

export class AutoPunchOutCron {

    public start(): void {

        cron.schedule(
            '0 19 * * *',
            async () => {
                await this.autoPunchOut();
            },
            {
                timezone: 'Asia/Kolkata',
            }
        );

        console.log(
            '✅ Auto Punch Out Cron Started'
        );
    }

    private async autoPunchOut(): Promise<void> {

        try {

            console.log(
                'Running Auto Punch Out Cron'
            );

            const today =
                getTodayDate();

            const attendanceList =
                await Attendance.findAll({
                    where: {
                        date: today,
                        checkOut: {
                            [Op.is]: null,
                        } as any,
                    }
                });

            for (const attendance of attendanceList) {

                if (!attendance.checkIn) {
                    continue;
                }

                const checkOutTime = new Date();

                const checkInTime = new Date(
                    attendance.checkIn
                );
                const workingHours =
                    Number((
                        (checkOutTime.getTime() -
                            checkInTime.getTime()) /
                        (1000 * 60 * 60)
                    ).toFixed(2));

                attendance.checkOut =
                    checkOutTime;

                attendance.workingHours =
                    workingHours;

                attendance.status =
                    'auto-punch-out';

                await attendance.save();
            }

            console.log(
                '✅ Auto Punch Out Completed'
            );

        } catch (error) {

            console.error(
                '❌ Auto Punch Out Error',
                error
            );
        }
    }
}