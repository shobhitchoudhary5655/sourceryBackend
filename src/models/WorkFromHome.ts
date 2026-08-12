import {
  DataTypes,
  Model,
  Optional,
} from 'sequelize';

import sequelize from '../config/database';

import {
  IWorkFromHome,
} from '../interfaces/work-from-home.interface';

interface WorkFromHomeCreationAttributes
  extends Optional<
    IWorkFromHome,
    | 'id'
    | 'status'
  > {}

class WorkFromHome
  extends Model<
    IWorkFromHome,
    WorkFromHomeCreationAttributes
  >
  implements IWorkFromHome
{
  declare id: number;

  declare userId: number;

  declare date: string;

  declare status:
    | 'pending'
    | 'accepted'
    | 'rejected';

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

WorkFromHome.init(
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

    status: {
      type: DataTypes.ENUM(
        'pending',
        'accepted',
        'rejected'
      ),
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    tableName: 'workFromHomes',
    timestamps: true,
    modelName: 'WorkFromHome',
  }
);

export default WorkFromHome;