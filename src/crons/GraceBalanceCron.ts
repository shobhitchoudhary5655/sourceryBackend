import cron from 'node-cron';
import { User } from '../models';

export class GraceBalanceResetCron {

    public start(): void {
        cron.schedule('05 10 1 * *', async () => { await this.resetGraceBalance(); },
            { timezone: 'Asia/Kolkata', }
        );
        console.log('✅ Grace Balance Reset Cron Started');
    }

    private async resetGraceBalance(): Promise<void> {
        try {
            console.log('Running Grace Balance Reset Cron');
            const [updatedCount] = await User.update(
                { graceBalance: 240, },
                { where: {}, }
            );
            console.log(`✅ Grace Balance Reset Completed (${updatedCount} users updated)`);
        } catch (error) {
            console.error('❌ Grace Balance Reset Error', error);
        }
    }
}