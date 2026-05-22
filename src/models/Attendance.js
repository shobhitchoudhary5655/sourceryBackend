const { DataTypes } = require('sequelize');

const sequelize = require('../config/db');

const Attendance = sequelize.define(
  'Attendance',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    checkIn: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    checkOut: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        'present',
        'absent',
        'halfday',
        'leave',
        'auto-punch-out'
      ),
      defaultValue: 'absent',
    },

    workingHours: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'attendances',
    timestamps: true,
  }
);

module.exports = Attendance;