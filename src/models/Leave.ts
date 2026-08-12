import {
  DataTypes,
  Model,
  Optional,
} from 'sequelize';

import sequelize from '../config/database';

import {
  ILeave,
} from '../interfaces/leave.interface';

interface LeaveCreationAttributes
  extends Optional<
    ILeave,
    | 'id'
    | 'status'
    | 'approvedBy'
    | 'approvedAt'
    | 'rejectionReason'
  > {}

class Leave
  extends Model<
    ILeave,
    LeaveCreationAttributes
  >
  implements ILeave
{
  declare id: number;

  declare userId: number;

  declare leaveType:
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
    | 'rejected';

  declare approvedBy?: number;

  declare approvedAt?: Date;

  declare rejectionReason?: string;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

Leave.init(
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

    leaveType: {
      type: DataTypes.ENUM(
        'Casual',
        'Sick',
        'Paid',
        'Emergency'
        
      ),
      allowNull: false,
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
        'rejected'
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
  },
  {
    sequelize,
    tableName: 'leaves',
    timestamps: true,
    modelName: 'Leave',
  }
);

export default Leave;