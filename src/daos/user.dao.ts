import { Op } from 'sequelize';
import { User, Role, } from '../models';
import { UserCreationAttributes } from '../models/User';

class UserDao {

  public async findUserByEmail(email: string) {
    return User.findOne({
      where: {
        email,
      },
    });
  }

  public async createEmployee(data: UserCreationAttributes) {
    return User.create(data);
  }

  public async getAllEmployees(roleId: number) {
    return User.findAll({
      where: { roleId, },
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'name',],
        },
      ],
      order: [['name', 'ASC']],
    });
  }

  public async getUsers() {
    return User.findAll({
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'name',
          ],
        },
      ],
    });
  }

  public async getUsersByRoles(roleIds: number[], filters: { search?: string; designation?: string; page: number; limit: number; }) {
    const { search, designation, page, limit, } = filters;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const where: any = {
      roleId: {
        [Op.in]: roleIds,
      },
    };
    const cleanSearch = (search || '').trim();
    if (cleanSearch.length > 0) {
      where[Op.or] = [
        { name: { [Op.like]: `%${cleanSearch}%` } },
        { email: { [Op.like]: `%${cleanSearch}%` } },
        { designation: { [Op.like]: `%${cleanSearch}%` } },
      ];
    }
    if (designation) {
      where.designation = designation;
    }
    const offset = (pageNum - 1) * limitNum;
    const { count, rows } = await User.findAndCountAll({
      where,
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'name'],
        },
      ],
      limit: limitNum,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      users: rows,
      total: count,
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum,
    };
  }

  public async updateProfileImage(userId: number, profileImage: string) {
    return User.update(
      { profileImage, },
      {
        where: {
          id: userId,
        },
      }
    );
  }
}

export default new UserDao();

// const { User, Role } = require("../models");
// const {Op} = require('sequelize')

// const findUserByEmail = async (email) => {
//     return await User.findOne({
//         where: { email }
//     });
// };

// const getAllEmployees = async (roleId) => {
//     return await User.findAll({
//         where: { roleId },
//         include: [
//             {
//                 model: Role,
//                 attributes: [
//                     'id',
//                     'name'
//                 ],
//             },
//         ],
//         order: [['name', 'ASC']]
//     });
// };

// const createEmployee = async (data) => {
//     return await User.create(data);
// };

// const getUsers = async() => {
//     return await User.findAll({
//         include: {
//             model:Role,
//             attributes: ['id', 'name']
//         }
//     })
// }

// // const getUsersByRoles = async (roleIds) => {
// //     return await User.findAll({
// //         where: {
// //             roleId : {
// //                 [Op.in] : roleIds,
// //             },
// //         },
// //         include: [
// //             {
// //                 model : Role,
// //                 attributes:['id','name'],
// //             },
// //         ],
// //     })
// // }

// const getUsersByRoles = async (
//   roleIds,
//   filters
// ) => {

//   const {
//     search,
//     designation,
//     page,
//     limit,
//   } = filters;

//   const where = {
//     roleId: {
//       [Op.in]: roleIds,
//     },
//   };

//   // Search filter

//   if (search) {
//   where[Op.or] = [
//     {
//       name: {
//         [Op.like]: `%${search}%`,
//       },
//     },
//     {
//       email: {
//         [Op.like]: `%${search}%`,
//       },
//     },
//     {
//       designation: {
//         [Op.like]: `%${search}%`,
//       },
//     },
//   ];
// }

//   // Designation filter

//   if (designation) {
//     where.designation =
//       designation;
//   }

//   const offset =
//     (page - 1) * limit;

//   const {
//     count,
//     rows,
//   } =
//     await User.findAndCountAll({
//       where,
//       include: [
//         {
//           model: Role,
//           attributes: [
//             'id',
//             'name',
//           ],
//         },
//       ],
//       limit:
//         Number(limit),
//       offset:
//         Number(offset),
//       order: [
//         ['createdAt', 'DESC'],
//       ],
//     });

//   return {
//     users: rows,
//     total: count,
//     totalPages:
//       Math.ceil(
//         count / limit
//       ),
//     currentPage:
//       Number(page),
//   };
// };

// module.exports = {
//     findUserByEmail,
//     getAllEmployees,
//     createEmployee,
//     getUsersByRoles,
// };