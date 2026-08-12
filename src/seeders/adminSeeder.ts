import 'dotenv/config';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database';
import { User, Role, } from '../models';

export class AdminSeeder {

  public static async seed(): Promise<void> {
    try {
      await sequelize.sync();

      const adminRole = await Role.findOne({
        where: {
          name: 'admin',
        },
      });

      if (!adminRole) {
        console.log('Please run role seeder first');
        process.exit(1);
      }

      const existingAdmin = await User.findOne({
        where: {
          email: 'admin@gmail.com',
        },
      });

      if (existingAdmin) {
        console.log('Admin already exists');
        process.exit(0);
      }

      const hashedPassword = await bcrypt.hash('Admin@123', 10);

      await User.create({
        name: 'Super Admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        roleId: adminRole.id,
      });

      console.log('✅ Admin Seeded Successfully');
      process.exit(0);

    } catch (error) {
      console.error('❌ Admin Seeder Error:', error);
      process.exit(1);
    }
  }
}