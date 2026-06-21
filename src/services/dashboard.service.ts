import { Op } from 'sequelize';
import { User, Attendance, Holiday,Request} from '../models';

class DashboardService {

  public getDashboardStats = async () => {
    const today = new Date();

    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    );

    const totalEmployees = await User.count();

    const presentToday = await Attendance.count({
      where: {
        status: 'present',
        date: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    const upcomingHolidays = await Holiday.findAll({
      where: {
        date: {
          [Op.gte]: today,
        },
      },
      order: [['date', 'ASC']],
      limit: 3,
    });

    const pendingLeaves = await Request.count({
      where: {
        status: 'pending',
      },
    });

    // const pendingWorkFromHome = await WorkFromHome.count({
    //   where: {
    //     status: 'pending',
    //   },
    // });

    return {
      success: true,
      stats: {
        totalEmployees,
        presentToday,
        absentToday: totalEmployees - presentToday,
      },
      pendingRequest: {
        leaveRequest: pendingLeaves,
        wfhRequests: 0,
      },
      upcomingHolidays,
    };
  };
}

export default new DashboardService();