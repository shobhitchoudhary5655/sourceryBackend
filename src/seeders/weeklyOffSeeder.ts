import 'dotenv/config';

import sequelize from '../config/database';
import { WeeklyOff } from '../models';

export class WeeklyOffSeeder {

    public static async seed(): Promise<void> {
        try {
            await sequelize.sync();
            const days: string[] = [
                'Saturday',
                'Sunday',
            ];

            for (const day of days) {
                const existingWeeklyOff = await WeeklyOff.findOne({
                    where: {
                        dayName: day,
                    },
                });

                if (!existingWeeklyOff) {
                    await WeeklyOff.create({
                        dayName: day,
                    });

                    console.log(`✅ ${day} inserted`);
                }
            }

            console.log('✅ Weekly Off Seeded Successfully');
            process.exit(0);
        } catch (error) {
            console.error('❌ Weekly Off Seeder Error:', error);
            process.exit(1);
        }
    }
}

// WeeklyOffSeeder.seed();

// require('dotenv').config();
// const sequelize = require('../config/db');
// const WeeklyOff = require('../models/WeeklyOff');

// const weeklyOffSeeder = async () => {
//     try {
//         await sequelize.sync();
//         const days = ['Saturday', 'Sunday'];
//         for (const day of days) {
//             const existing = await WeeklyOff.findOne({
//                 where: {
//                     dayName: day,
//                 },
//             });

//             if (!existing) {
//                 await WeeklyOff.create({
//                     dayName: day,
//                 });
//             }
//         }
//         console.log('Weekly Off Seeded');
//         process.exit();
//     } catch (error) {
//         console.log(error);
//         process.exit(1);
//     }
// };

// weeklyOffSeeder();