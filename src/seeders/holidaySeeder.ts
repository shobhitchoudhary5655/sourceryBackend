import 'dotenv/config';
import sequelize from '../config/database';
import { Holiday } from '../models';
export class HolidaySeeder {

  public static async seed(): Promise<void> {
    try {
      await sequelize.sync();

      const holidays = [
        { holidayName: 'Republic Day', date: '2026-01-26', },
        { holidayName: 'Independence Day', date: '2026-08-15', },
      ];

      for (const holiday of holidays) {
        const existingHoliday = await Holiday.findOne({
          where: {
            date: holiday.date,
          },
        });

        if (!existingHoliday) {
          await Holiday.create({
            holidayName: holiday.holidayName,
            date: holiday.date,
             holidayType: "PUBLIC",
          });

          console.log(`✅ ${holiday.holidayName} inserted`);
        }
      }

      console.log('✅ Holidays Seeded Successfully');
      process.exit(0);
    } catch (error) {
      console.error('❌ Holiday Seeder Error:', error);
      process.exit(1);
    }
  }
}

// HolidaySeeder.seed();

// require('dotenv').config();
// const sequelize = require('../config/db');
// const Holiday = require('../models/Holiday');

// const holidaySeeder = async () => {
//   try {
//     await sequelize.sync();
//     const holidays = [
//       {
//         holidayName: 'Republic Day',
//         date: '2026-01-26',
//       },
//       {
//         holidayName: 'Independence Day',
//         date: '2026-08-15',
//       },
//     ];

//     for (const holiday of holidays) {
//       const existing = await Holiday.findOne({
//         where: {
//           date: holiday.date,
//         },
//       });

//       if (!existing) {
//         await Holiday.create(holiday);
//         console.log(`${holiday.holidayName} inserted`);
//       }
//     }
//     console.log('Holiday Seeded');
//     process.exit();
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   }
// };

// holidaySeeder();