import { DataTypes, Model, Optional, } from 'sequelize';
import sequelize from '../config/database';
import { ISalaryPayment } from '../interfaces/salary.interface';

export interface SalaryPaymentCreationAttributes
    extends Optional<
        ISalaryPayment,
        | 'id'
        | 'paidDate'
        | 'paidBy'
        | 'remarks'
        | 'status'
    > { }

class SalaryPayment
    extends Model<
        ISalaryPayment,
        SalaryPaymentCreationAttributes
    >
    implements ISalaryPayment {
    declare id: number;

    declare userId: number;

    declare month: number;

    declare year: number;

    declare salary: number;

    declare status: 'Pending' | 'Paid';

    declare paidDate?: Date | null;

    declare paidBy?: number | null;

    declare remarks?: string | null;

    declare readonly createdAt: Date;

    declare readonly updatedAt: Date;
}

SalaryPayment.init(
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

        month: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        salary: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: null,
        },

        status: {
            type: DataTypes.ENUM(
                'Pending',
                'Paid'
            ),
            allowNull: true,
            defaultValue: 'Pending',
        },

        paidDate: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },

        paidBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
        },

        remarks: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
        },
    },
    {
        sequelize,
        tableName: 'salary_payments',
        timestamps: true,
        modelName: 'SalaryPayment',
    }
);

export default SalaryPayment;