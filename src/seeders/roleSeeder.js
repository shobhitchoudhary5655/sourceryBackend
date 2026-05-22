require('dotenv').config();

const sequelize = require('../config/db');

const Role = require('../models/Role');

const seedRoles = async () => {
  try {
    await sequelize.sync();

    const roles = [
      {
        name: 'admin',
      },
      {
        name: 'hr',
      },
      {
        name: 'employee',
      },
    ];

    for (const role of roles) {
      const existingRole =
        await Role.findOne({
          where: {
            name: role.name,
          },
        });

      if (!existingRole) {
        await Role.create(role);
      }
    }

    console.log(
      'Roles Seeded Successfully'
    );

    process.exit();
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

seedRoles();