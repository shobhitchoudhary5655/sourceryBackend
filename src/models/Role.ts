import {DataTypes,Model,Optional,} from 'sequelize';
import sequelize from '../config/database';
import {IRole,} from '../interfaces/role.interface';

interface RoleCreationAttributes
  extends Optional<
    IRole,
    'id'
  > {}

class Role
  extends Model<
    IRole,
    RoleCreationAttributes
  >
  implements IRole
{
  declare id: number;
  declare name: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'roles',
    timestamps: true,
    modelName: 'Role',
  }
);

export default Role;

// const { DataTypes } = require('sequelize');

// const sequelize = require('../config/db');

// const Role = sequelize.define(
//   'Role',
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },

//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//   },
//   {
//     tableName: 'roles',
//     timestamps: true,
//   }
// );

// module.exports = Role;