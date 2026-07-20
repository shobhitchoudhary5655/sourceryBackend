import cron from "node-cron";
import salaryService from "../services/salary.service";

export class SalaryGenerationCron {

    public start(): void {
        cron.schedule("3 10 1 * *", async () => {
            await this.generateSalary();
        },
            {
                timezone: "Asia/Kolkata",
            }
        );

        console.log("✅ Salary Generation Cron Started");
    }

    private async generateSalary(): Promise<void> {

        try {

            console.log("Running Salary Generation Cron");

            const today = new Date();

            // Generate salary for previous month
            let month = today.getMonth(); // 0-11

            let year = today.getFullYear();

            // January -> Previous month is December of last year
            if (month === 0) {
                month = 12;
                year--;
            }

            const result = await salaryService.createSalary({
                month,
                year,
            });

            console.log("✅ Salary Generation Completed");

            console.log(result);

        } catch (error) {

            console.error(
                "❌ Salary Generation Error",
                error
            );
        }
    }
}