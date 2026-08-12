import { Op } from 'sequelize';
import { User, Role, Attendance, Break } from '../models';
import { UserCreationAttributes } from '../models/User';
import { getTodayDate } from '../utils/dateHelper';

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
    const today = getTodayDate();
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
        {
          model: Attendance,
          as: 'attendances',
          required: false,
          where: {
            date: today,
          },
          attributes: [
            'id',
            'date',
            'status',
            'checkIn',
            'checkOut',
            'officeHours',
            'workingHours',
          ],
          include: [
            {
              model: Break,
              as: "breaks",
              required: false,
              attributes: [
                "id",
                "startTime",
                "endTime",
                "durationMinutes",
              ],
            },
          ],
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

  public async findById(id: number) {
    return User.findByPk(id);
  }
}

export default new UserDao();