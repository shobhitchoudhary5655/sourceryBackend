require('dotenv').config();

const bcrypt = require('bcryptjs');

const sequelize = require('../config/db');

const User = require('../models/User');

const Role = require('../models/Role');

const seedAdmin = async () => {
  try {
    await sequelize.sync();

    const adminRole =
      await Role.findOne({
        where: {
          name: 'admin',
        },
      });

    if (!adminRole) {
      console.log(
        'Please run role seeder first'
      );

      process.exit();
    }

    const existingAdmin =
      await User.findOne({
        where: {
          email: 'admin@gmail.com',
        },
      });

    if (existingAdmin) {
      console.log(
        'Admin already exists'
      );

      process.exit();
    }

    const hashedPassword =
      await bcrypt.hash(
        'Admin@123',
        10
      );

    await User.create({
      name: 'Super Admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      roleId: adminRole.id,
    });

    console.log(
      'Admin Seeded Successfully'
    );

    process.exit();
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

seedAdmin();