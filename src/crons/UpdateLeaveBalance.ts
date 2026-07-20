import cron from "node-cron";
import { Sequelize } from "sequelize";
import { User } from "../models";

export class LeaveBalanceCron {

    public start(): void {
        cron.schedule("05 10 1 * *", async () => {
            await this.creditLeaveBalance();
        },
            { timezone: "Asia/Kolkata", }
        );
        console.log("✅ Leave Balance Cron Started");
    }

    private async creditLeaveBalance(): Promise<void> {
        try {
            console.log("Running Monthly Leave Credit");
            await User.update(
                {
                    clBalance: Sequelize.literal("clBalance + 0.5"),
                    slBalance: Sequelize.literal("slBalance + 0.5"),
                },
                {
                    where: {},
                }
            );
            console.log("✅ Leave credited successfully");
        } catch (error) {
            console.error(error);
        }
    }
}