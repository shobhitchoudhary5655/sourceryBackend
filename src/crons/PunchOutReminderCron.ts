import cron from "node-cron";
import { Op } from "sequelize";

import { Attendance, User } from "../models";
import { getTodayDate } from "../utils/dateHelper";
import NotificationService from "../services/notification.service";

export class PunchOutReminderCron {

    public start(): void {

        cron.schedule(
            "0 19 * * *", // 7:00 PM
            async () => {
                await this.sendReminder();
            },
            {
                timezone: "Asia/Kolkata",
            }
        );

        console.log("✅ Punch Out Reminder Cron Started");
    }

    private async sendReminder() {

        try {

            console.log("Running Punch Out Reminder Cron");

            const today = getTodayDate();

            const attendanceList = await Attendance.findAll({
                where: {
                    date: today,
                    checkIn: {
                        [Op.ne]: null,
                    } as any,
                    checkOut: {
                        [Op.is]: null,
                    } as any,
                },
            });

            for (const attendance of attendanceList as any[]) {

                await NotificationService.sendToUser({

                    userId: attendance.userId,

                    title: "Punch Out Reminder",

                    body:
                        "You have not punched out yet. Please punch out before leaving office.",

                    type: "ATTENDANCE",

                    referenceId: attendance.id,

                    data: {
                        screen: "Attendance",
                    },
                });
            }

            console.log(
                `✅ Reminder sent to ${attendanceList.length} employees`
            );

        } catch (error) {

            console.error(
                "Punch Out Reminder Error",
                error
            );
        }
    }
}