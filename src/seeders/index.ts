import { RoleSeeder } from './roleSeeder';
import { HolidaySeeder } from './holidaySeeder';
import { WeeklyOffSeeder } from './weeklyOffSeeder';
import { AdminSeeder } from './adminSeeder';

class SeederRunner {

    public static async run(): Promise<void> {
        try {
            console.log('🌱 Running Seeders...');
            await RoleSeeder.seed();
            await HolidaySeeder.seed();
            await WeeklyOffSeeder.seed();
            await AdminSeeder.seed();
            console.log('✅ All Seeders Completed');
            process.exit(0);
        } catch (error) {
            console.error('❌ Seeder Runner Error:', error);
            process.exit(1);
        }
    }
}

SeederRunner.run();