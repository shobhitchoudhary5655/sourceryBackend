import {
    DataTypes,
    Model,
    Optional,
} from "sequelize";

import sequelize from "../config/database";
import { INotification } from "../interfaces/notification.interface";

export interface NotificationCreationAttributes
    extends Optional<
        INotification,
        | "id"
        | "referenceId"
        | "isRead"
        | "createdAt"
        | "updatedAt"
    > { }

class Notification
    extends Model<
        INotification,
        NotificationCreationAttributes
    >
    implements INotification {
    declare id: number;

    declare userId: number;

    declare title: string;

    declare body: string;

    declare type:
        "LEAVE"
        | "WFH"
        | "ATTENDANCE"
        | "BIRTHDAY"
        | "ANNOUNCEMENT"
        | "SALARY"
        | "DOCUMENT"
        | "HOLIDAY"
        | "GENERAL";

    declare referenceId?: number | null;

    declare isRead: boolean;

    declare readonly createdAt: Date;

    declare readonly updatedAt: Date;
}

Notification.init(
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

        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        body: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        type: {
            type: DataTypes.ENUM(
                "LEAVE",
                "WFH",
                "ATTENDANCE",
                "BIRTHDAY",
                "ANNOUNCEMENT",
                "SALARY",
                "DOCUMENT",
                "HOLIDAY",
                "GENERAL",
            ),
            allowNull: false,
        },

        referenceId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
        },

        isRead: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: "notifications",
        timestamps: true,
        modelName: "Notification",
    },
);

export default Notification;