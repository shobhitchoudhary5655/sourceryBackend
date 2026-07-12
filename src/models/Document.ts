import { DataTypes, Model, Optional, } from 'sequelize';
import sequelize from '../config/database';

export interface EmployeeDocumentAttributes {
    id: number;
    userId: number;
    documentType: string;
    documentName: string;
    documentUrl: string;
    documentPath: string;
    mimeType: string;
    fileSize: number;
    status: "pending" | "approved" | "rejected";
    remarks?: string | null;
}

type EmployeeDocumentCreationAttributes = Optional<
    EmployeeDocumentAttributes,
    "id" | "status" | "remarks"
>;

class EmployeeDocument extends Model<
    EmployeeDocumentAttributes,
    EmployeeDocumentCreationAttributes
> implements EmployeeDocumentAttributes {

    public id!: number;

    public userId!: number;

    public documentType!: string;

    public documentName!: string;

    public documentUrl!: string;

    public documentPath!: string;

    public mimeType!: string;

    public fileSize!: number;

    public status!: "pending" | "approved" | "rejected";

    public remarks!: string | null;
}

EmployeeDocument.init(
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

        documentType: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        documentName: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        documentUrl: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        documentPath: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        mimeType: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        fileSize: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        status: {
            type: DataTypes.ENUM(
                "pending",
                "approved",
                "rejected"
            ),
            defaultValue: "pending",
        },

        remarks: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "employee_documents",
        timestamps: true,
    }
);

export default EmployeeDocument;