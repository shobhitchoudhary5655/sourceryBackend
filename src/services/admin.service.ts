import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import Holiday from '../models/Holiday';
import { User } from '../models';
import userDAO from '../daos/user.dao';
import roleDAO from '../daos/role.dao';
import attendanceDAO from '../daos/attendance.dao';
import { formatDate } from '../utils/dateHelper';
import { getWeeklyOffDates } from '../utils/weeklyOff.helper';

class AdminService {

  public getEmployees = async (query: any) => {
    const {
      search = '',
      designation = '',
      page = 1,
      limit = 10,
    } = query;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const roles = await roleDAO.getRolesByName(['employee', 'hr']);
    const roleIds = roles.map((r: any) => r.id);
    if (!roleIds.length) {
      return {
        users: [],
        total: 0,
        totalPages: 0,
        currentPage: pageNum,
      };
    }

    const result = await userDAO.getUsersByRoles(roleIds, {
      search,
      designation,
      page: pageNum,
      limit: limitNum,
    });

    return result;
  };

  public createEmployee = async (body: any) => {
    const { name, email, password, phone, designation, roleId } = body;

    const role = await roleDAO.findRole(roleId);
    if (!role) {
      return { success: false, message: 'Invalid role' };
    }

    const existingUser = await userDAO.findUserByEmail(email);
    if (existingUser) {
      return { success: false, message: 'Employee already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userDAO.createEmployee({
      name,
      email,
      password: hashedPassword,
      phone,
      designation,
      roleId,
    });

    return {
      success: true,
      message: 'Employee Created Successfully',
    };
  };

  // ✅ ATTENDANCE
  // public getEmployeeAttendance = async (employeeId: string) => {
  //   const attendance = await attendanceDAO.getEmployeeAttendance(employeeId);
  //   return { success: true, attendance };
  // };

  public getEmployeeAttendance = async ( employeeId: string) => {
    return attendanceDAO.getEmployeeAttendance(
      employeeId
    );
  };

  // ✅ ATTENDANCE STATUS
  public getAttendanceStatus = async (employeeId: string, query: any) => {
    const { month, year } = query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const attendance = await attendanceDAO.getAttendanceStatus(employeeId, startDate, endDate);
    let present = 0, absent = 0, leave = 0, wfh = 0;
    attendance.forEach((item: any) => {
      if (item.status === 'present') present++;
      if (item.status === 'absent') absent++;
      if (item.status === 'leave') leave++;
      if (item.status === 'wfh') wfh++;
    });

    const totalDays = new Date(year, month, 0).getDate();

    const holidays = await Holiday.findAll({
      where: { date: { [Op.between]: [startDate, endDate] } },
    });

    const holidayDates = holidays.map((h: any) =>
      formatDate(new Date(h.date))
    );

    // const weeklyOffs = await WeeklyOff.findAll();
    // const weeklyOffDays = weeklyOffs.map((w: any) => w.dayName);

    // const weeklyOffDates: string[] = [];

    // for (let d = 1; d <= totalDays; d++) {
    //   const date = new Date(year, month - 1, d);

    //   const dayName = date.toLocaleDateString('en-US', {
    //     timeZone: 'Asia/Kolkata',
    //     weekday: 'long',
    //   });

    //   if (weeklyOffDays.includes(dayName)) {
    //     weeklyOffDates.push(formatDate(date));
    //   }
    // }
    const monthNum = Number(month);
    const yearNum = Number(year);
    const weeklyOffDates = getWeeklyOffDates(   monthNum,   yearNum );
    const weeklyOff = weeklyOffDates.length;
    const holidayCount = holidayDates.length;
    const workingDays = totalDays - weeklyOff - holidayCount;

    const attendancePercentage =
      workingDays > 0
        ? (((present + wfh) / workingDays) * 100).toFixed(2)
        : 0;

    return {
      success: true,
      weeklyOffDates,
      holidayDates,
      status: {
        present,
        absent,
        leave,
        wfh,
        holiday: holidayCount,
        weeklyOff,
        workingDays,
        attendancePercentage,
      },
    };
  };

  public getEmployeeDetails = async (employeeId: string) => {
    const employee = await User.findByPk(employeeId, {
      attributes: { exclude: ['password'] },
    });

    if (!employee) {
      return { success: false, message: 'Employee not found' };
    }

    return { success: true, employee };
  };

  public editEmployeesDetails = async (id: string, body: any) => {
    const employee = await User.findByPk(id);

    if (!employee) {
      return { success: false, message: 'User not found' };
    }

    await employee.update(body);

    return {
      success: true,
      message: 'Data updated successfully',
      data: employee,
    };
  };

  public deleteEmployee = async (id: string) => {
    const employee = await User.findByPk(id);

    if (!employee) {
      return { success: false, message: 'Employee not found' };
    }

    await employee.destroy();

    return {
      success: true,
      message: 'Employee deleted successfully',
    };
  };
}

export default new AdminService();