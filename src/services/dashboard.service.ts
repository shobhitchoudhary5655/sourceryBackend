import { Op } from 'sequelize';
import { User, Attendance, Holiday, Request } from '../models';

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

    const totalEmployees = await User.count({
      where: {
        roleId: {
          [Op.ne]: 1, // Exclude Admin
        },
      },
    });

    const presentToday = await Attendance.count({
      where: {
        status: 'present',
        date: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
      include: [
        {
          model: User,
          as: 'user',
          where: {
            roleId: {
              [Op.ne]: 1,
            },
          },
          attributes: [],
        },
      ],
    });

    const leaveToday = await Request.count({
      where: {
        requestType: 'leave',
        status: 'approved',
        startDate: {
          [Op.lte]: endOfDay,
        },
        endDate: {
          [Op.gte]: startOfDay,
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

    const approvedLeave = await Request.count({
      where: {
        requestType: 'leave',
        status: 'approved',
      },
    });

    const pendingLeave = await Request.count({
      where: {
        requestType: 'leave',
        status: 'pending',
      },
    });

    const rejectedLeave = await Request.count({
      where: {
        requestType: 'leave',
        status: 'rejected',
      },
    });

    const approvedWFH = await Request.count({
      where: {
        requestType: 'wfh',
        status: 'approved',
      },
    });

    const pendingWFH = await Request.count({
      where: {
        requestType: 'wfh',
        status: 'pending',
      },
    });

    const rejectedWFH = await Request.count({
      where: {
        requestType: 'wfh',
        status: 'rejected',
      },
    });

    const weeklyAttendance = [];

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const startOfWeek = new Date(today);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(today.getDate() - today.getDay());
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);

      const start = new Date(currentDay);
      start.setHours(0, 0, 0, 0);

      const end = new Date(currentDay);
      end.setHours(23, 59, 59, 999);

      const present = await Attendance.count({
        where: {
          status: 'present',
          date: {
            [Op.between]: [start, end],
          },
        },
        include: [
          {
            model: User,
            as: 'user',
            where: {
              roleId: {
                [Op.ne]: 1,
              },
            },
            attributes: [],
          },
        ],
      });

      const leave = await Request.count({
        where: {
          requestType: 'leave',
          status: 'approved',
          startDate: {
            [Op.lte]: end,
          },
          endDate: {
            [Op.gte]: start,
          },
        },
        include: [
          {
            model: User,
            as: 'user',
            where: {
              roleId: {
                [Op.ne]: 1,
              },
            },
            attributes: [],
          },
        ],
      });

      const absent = Math.max(
        totalEmployees - present - leave,
        0
      );

      weeklyAttendance.push({
        day: days[currentDay.getDay()],
        present,
        absent,
        leave,
      });
    }

    return {
      success: true,
      stats: {
        totalEmployees,
        presentToday,
        absentToday: Math.max(totalEmployees - presentToday - leaveToday, 0),
        leaveToday,
      },
      pendingRequest: {
        leaveRequest: pendingLeave,
        wfhRequests: pendingWFH,
      },
      weeklyAttendance,

      requestSummary: {
        approvedLeave,
        pendingLeave,
        rejectedLeave,

        approvedWFH,
        pendingWFH,
        rejectedWFH,
      },
      upcomingHolidays,
    };
  };
}

export default new DashboardService();