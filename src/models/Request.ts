import { DataTypes, Model, Optional, } from 'sequelize';
import sequelize from '../config/database';
import { IRequest, } from '../interfaces/request.interface';

interface RequestCreationAttributes
    extends Optional<
        IRequest,
        | 'id'
        | 'status'
        | 'approvedBy'
        | 'approvedAt'
        | 'rejectionReason'
        | 'leaveType'
        | 'lopDays'
    > { }

class Request
    extends Model<
        IRequest,
        RequestCreationAttributes
    >
    implements IRequest {

    declare id: number;
    declare userId: number;
    declare requestGroupId: string;
    declare requestType:
        | 'leave'
        | 'wfh';
    declare leaveType?:
        | 'Casual'
        | 'Sick'
        | 'Paid'
        | 'Emergency';
    declare startDate: string;
    declare endDate: string;
    declare reason?: string;
    declare status:
        | 'pending'
        | 'approved'
        | 'rejected'
        | "cancelled";
    declare approvedBy?: number;
    declare approvedAt?: Date;
    declare rejectionReason?: string;
    declare lopDays?: number;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Request.init(
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
        requestGroupId: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        requestType: {
            type: DataTypes.ENUM(
                'leave',
                'wfh'
            ),
            allowNull: false,
        },

        leaveType: {
            type: DataTypes.ENUM(
                'Casual',
                'Sick',
                'Paid',
                'Emergency'
            ),
            allowNull: true,
        },

        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },

        endDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },

        reason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        status: {
            type: DataTypes.ENUM(
                'pending',
                'approved',
                'rejected',
                "cancelled",
            ),
            defaultValue: 'pending',
        },

        approvedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        approvedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        rejectionReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        lopDays: {
            type: DataTypes.DECIMAL(4, 1),
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        tableName: 'requests',
        modelName: 'Request',
        timestamps: true,
    }
);

export default Request;