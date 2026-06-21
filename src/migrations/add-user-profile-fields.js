'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'users',
      'employeeId',
      {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      }
    );

    await queryInterface.addColumn(
      'users',
      'gender',
      {
        type: Sequelize.ENUM(
          'Male',
          'Female',
          'Other'
        ),
        allowNull: true,
      }
    );

    await queryInterface.addColumn(
      'users',
      'dateOfBirth',
      {
        type: Sequelize.DATEONLY,
        allowNull: true,
      }
    );

    await queryInterface.addColumn(
      'users',
      'joiningDate',
      {
        type: Sequelize.DATEONLY,
        allowNull: true,
      }
    );

    await queryInterface.addColumn(
      'users',
      'workLocation',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );

    await queryInterface.addColumn(
      'users',
      'employeeType',
      {
        type: Sequelize.ENUM(
          'Permanent',
          'Contract',
          'Intern'
        ),
        allowNull: true,
      }
    );

    await queryInterface.addColumn(
      'users',
      'profileImage',
      {
        type: Sequelize.TEXT,
        allowNull: true,
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      'users',
      'employeeId'
    );

    await queryInterface.removeColumn(
      'users',
      'gender'
    );

    await queryInterface.removeColumn(
      'users',
      'dateOfBirth'
    );

    await queryInterface.removeColumn(
      'users',
      'department'
    );

    await queryInterface.removeColumn(
      'users',
      'joiningDate'
    );

    await queryInterface.removeColumn(
      'users',
      'reportingManager'
    );

    await queryInterface.removeColumn(
      'users',
      'workLocation'
    );

    await queryInterface.removeColumn(
      'users',
      'employeeType'
    );

    await queryInterface.removeColumn(
      'users',
      'profileImage'
    );
  },
};