const bcrypt = require('bcryptjs');

const { User, Role } = require('../models');

exports.getEmployees = async (
  req,
  res
) => {
  try {
    const employeeRole =
      await Role.findOne({
        where: {
          name: 'employee',
        },
      });

    const users = await User.findAll({
      where: {
        roleId: employeeRole.id,
      },
      include: [
        {
          model: Role,
          attributes: ['id', 'name'],
        },
      ],
      order: [['id', 'DESC']],
    });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.createEmployee =
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        phone,
        designation,
      } = req.body;

      const existingUser =
        await User.findOne({
          where: { email },
        });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message:
            'Employee already exists',
        });
      }

      const employeeRole =
        await Role.findOne({
          where: {
            name: 'employee',
          },
        });

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        designation,
        roleId: employeeRole.id,
      });

      res.status(201).json({
        success: true,
        message:
          'Employee Created Successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };