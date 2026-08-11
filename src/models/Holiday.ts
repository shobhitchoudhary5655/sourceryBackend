import { DataTypes, Model, Optional, } from 'sequelize';
import sequelize from '../config/database';
import HolidayUser from "./HolidayUser";
import { IHoliday, } from '../interfaces/holiday.interface';
interface HolidayCreationAttributes
  extends Optional<IHoliday, 'id'> { }

class Holiday
  extends Model<
    IHoliday,
    HolidayCreationAttributes
  >
  implements IHoliday {
  declare id: number;
  declare holidayName: string;
  declare date: string;
  declare holidayType: 'PUBLIC' | 'SPECIAL_HOLIDAY' | 'SPECIAL_WFH';
  declare description?: string | undefined;
  declare employees?: HolidayUser[];
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Holiday.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    holidayName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      // unique: true,
    },

    holidayType: {
      type: DataTypes.ENUM(
        "PUBLIC",
        "SPECIAL_HOLIDAY",
        "SPECIAL_WFH"
      ),
      defaultValue: "PUBLIC",
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

  },
  {
    sequelize,
    tableName: 'holidays',
    timestamps: true,
    modelName: 'Holiday',
  }
);

export default Holiday;

// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');

// const Holiday = sequelize.define(
//     'holiday',
//     {
//         id:{
//             type: DataTypes.INTEGER,
//             primaryKey:true,
//             autoIncrement:true,
//         },

//         holidayName:{
//             type: DataTypes.STRING,
//             allowNull:false,
//         },

//         date: {
//             type: DataTypes.DATEONLY,
//             allowNull:false,
//             unique:true,
//         },
//     },
//     {
//         tableName: 'holidays',
//         timestamps: true,
//     }
// )

// module.exports = Holiday;