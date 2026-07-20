import cron from "node-cron";
import { Op } from "sequelize";
import { Holiday, User } from "../models";
import notificationService from "../services/notification.service";

export class HolidayReminderCron {
    public start(): void {
        cron.schedule(
            "0 19 * * *", // Every day at 7 PM
            async () => {
                await this.sendHolidayReminder();
            },
            {
                timezone: "Asia/Kolkata",
            }
        );

        console.log("✅ Holiday Reminder Cron Started");
    }

    private async sendHolidayReminder(): Promise<void> {
        try {
            const tomorrow = new Date();

            tomorrow.setDate(tomorrow.getDate() + 1);

            const holiday = await Holiday.findOne({
                where: {
                    date: tomorrow.toISOString().split("T")[0],
                },
            });

            if (!holiday) {
                return;
            }

            const users = await User.findAll({
                where: {
                    status: "Active",
                },
            });

            for (const user of users) {
                await notificationService.sendToUser({
                    userId: user.id,
                    title: "Upcoming Holiday 🎉",
                    body: `Tomorrow is ${holiday.holidayName}. Enjoy your holiday!`,
                    type: "HOLIDAY",
                    referenceId: holiday.id,
                });
            }

            console.log("✅ Holiday reminders sent");
        } catch (error) {
            console.error(error);
        }
    }
}