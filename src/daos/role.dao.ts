import { Op } from 'sequelize';
import { Role } from '../models';

class RoleDao {

  public async findByName(roleName: string) {
    return Role.findOne({
      where: { name: roleName },
    });
  }

  public async findAll() {
    return Role.findAll({
      attributes: ['id', 'name'],
      where: {
        name: {
          [Op.in]: ['hr', 'employee'],
        },
      },
    });
  }

  public async findRole(roleId: number) {
    return Role.findByPk(roleId);
  }

  public async getRolesByName(roleNames: string[]) {
    return Role.findAll({
      where: {
        name: {
          [Op.in]: roleNames,
        },
      },
    });
  }
}

export default new RoleDao();

// const {Role} = require("../models");
// const { Op, where } = require('sequelize');

// const findRoleByName = async (roleName) => {
//     return await Role.findOne({
//         where : {
//             name : roleName,
//         }
//     });
// };

// const getRoles = async () => {
//     return await Role.findAll({
//         attributes:['id','name'],
//         where: {
//             name:['hr','employee']
//         }
//     })
// }

// const findRole = async (roleId) => {
//     return await Role.findByPk(roleId)
// }

// const getRolesByName = async (roleNames) => {
//     return await Role.findAll({
//         where: {
//             name: {
//                 [Op.in]: roleNames
//             }
//         }
//     })
// }

// module.exports = {findRoleByName,getRoles,findRole,getRolesByName,}