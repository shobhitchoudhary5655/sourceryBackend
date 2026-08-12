import 'dotenv/config';

import sequelize from '../config/database';
import { Role } from '../models';

export class RoleSeeder {

  public static async seed(): Promise<void> {
    try {
      await sequelize.sync();

      const roles = [
        { name: 'admin', },
        { name: 'hr', },
        { name: 'employee', },
      ];

      for (const role of roles) {

        const existingRole = await Role.findOne({
          where: {
            name: role.name,
          },
        });

        if (!existingRole) {
          await Role.create({
            name: role.name,
          });
        }
      }

      console.log('✅ Roles Seeded Successfully');
      process.exit(0);
    } catch (error) {
      console.error('❌ Role Seeder Error:', error);
      process.exit(1);
    }
  }
}