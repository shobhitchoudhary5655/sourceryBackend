import { DataTypes, Model, Optional, } from "sequelize";
import sequelize from "../config/database";

interface IHolidayUser {
    id: number;
    holidayId: number;
    userId: number;
}

interface HolidayUserCreationAttributes
    extends Optional<IHolidayUser, "id"> { }

class HolidayUser
    extends Model<
        IHolidayUser,
        HolidayUserCreationAttributes> {
    declare id: number;
    declare holidayId: number;
    declare userId: number;
}

HolidayUser.init({

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    holidayId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }

}, {
    sequelize,
    tableName: "holiday_users",
    timestamps: false,
});

export default HolidayUser;