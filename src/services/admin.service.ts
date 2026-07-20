import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import Holiday from '../models/Holiday';
import { User, Attendance } from "../models";
import userDAO from '../daos/user.dao';
import roleDAO from '../daos/role.dao';
import attendanceDAO from '../daos/attendance.dao';
import { formatDate } from '../utils/dateHelper';
import { getWeeklyOffDates } from '../utils/weeklyOff.helper';
import { AttendanceStatus } from '../types/attendance.types';
import adminDao from '../daos/admin.dao';
import { CreateAttendanceDTO, UpdateAttendanceDTO } from "../dtos/attendance.dto";
import notificationService from './notification.service';

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

    const employee = await userDAO.createEmployee({
      name,
      email,
      password: hashedPassword,
      phone,
      designation,
      roleId,
    });

    await notificationService.sendToUser({
      userId: employee.id,
      title: "Welcome to SourceryIT",
      body: "Your employee account has been created successfully.",
      type: "GENERAL",
    });

    return {
      success: true,
      message: 'Employee Created Successfully',
    };
  };

  public getEmployeeAttendance = async (employeeId: string) => {
    return attendanceDAO.getEmployeeAttendance(
      employeeId
    );
  };

  public getAttendanceStatus = async (employeeId: string, query: any) => {
    const { month, year } = query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendance = await attendanceDAO.getAttendanceStatus(employeeId, startDate, endDate);
    let present = 0, absent = 0, leave = 0, wfh = 0;
    attendance.forEach((item: any) => {
      if (item.status === AttendanceStatus.PRESENT) present++;
      if (item.status === AttendanceStatus.ABSENT) absent++;
      if (item.status === AttendanceStatus.LEAVE) leave++;
      if (item.status === AttendanceStatus.AUTO_PUNCH_OUT) present++;
      if (item.status === AttendanceStatus.WORK_FROM_HOME) present++;
    });

    const totalDays = new Date(year, month, 0).getDate();

    const holidays = await Holiday.findAll({
      where: { date: { [Op.between]: [startDate, endDate] } },
    });

    const holidayDates = holidays.map((h: any) =>
      formatDate(new Date(h.date))
    );

    const monthNum = Number(month);
    const yearNum = Number(year);
    const weeklyOffDates = getWeeklyOffDates(monthNum, yearNum);
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
      return {
        success: false,
        message: "Employee not found",
      };
    }

    const newStatus = employee.status === "Active" ? "Inactive" : "Active";

    await employee.update({ status: newStatus, });
    await notificationService.sendToUser({
      userId: employee.id,
      title: "Account Status Updated",
      body:
        newStatus === "Active"
          ? "Your account has been activated."
          : "Your account has been deactivated.",
      type: "GENERAL",
    });
    return {
      success: true,
      message: `Employee ${newStatus.toLowerCase()} successfully`,
      status: newStatus,
    };
  };

  public async getEmployeeDocuments(id: number) {
    return await adminDao.getEmployeeDocuments(id);
  }

  public createAttendance = async (data: CreateAttendanceDTO) => {

    const user = await User.findByPk(data.userId);

    if (!user) {
      throw new Error("Employee not found.");
    }

    const alreadyExists = await Attendance.findOne({
      where: {
        userId: data.userId,
        date: data.date,
      },
    });

    if (alreadyExists) {
      throw new Error("Attendance already exists for this date.");
    }

    let officeHours = 0;
    let workingHours = 0;
    let effectiveHours = 0;

    let checkIn: Date | undefined;
    let checkOut: Date | undefined;

    if (
      data.checkIn &&
      data.checkOut &&
      (
        data.status === "present" ||
        data.status === "halfday" ||
        data.status === "work-from-home"
      )
    ) {

      checkIn = new Date(`${data.date}T${data.checkIn}:00`);

      checkOut = new Date(`${data.date}T${data.checkOut}:00`);

      officeHours =
        (checkOut.getTime() - checkIn.getTime()) /
        (1000 * 60 * 60);

      workingHours = officeHours;

      effectiveHours = officeHours;
    }

    const attendance = await Attendance.create({

      userId: data.userId,

      date: data.date,

      status: data.status,

      checkIn,

      checkOut,

      officeHours,

      workingHours,

      effectiveHours,

      breakMinutes: 0,

      location: data.location || undefined,

      notes: data.notes || undefined,

      latitude: 0,

      longitude: 0,

      inOffice:
        data.inOffice ?? true,

    });

    await notificationService.sendToUser({
      userId: attendance.userId,
      title: "Attendance Added",
      body: `Attendance for ${attendance.date} has been added by Admin.`,
      type: "ATTENDANCE",
      referenceId: attendance.id,
    });

    return {

      success: true,

      message: "Attendance added successfully.",

      attendance,

    };
  };

  public updateAttendance = async (
    attendanceId: number,
    data: UpdateAttendanceDTO
  ) => {

    const attendance = await Attendance.findByPk(attendanceId);

    if (!attendance) {
      throw new Error("Attendance not found.");
    }

    if (data.status) {
      attendance.status = data.status;
    }

    if (data.location !== undefined) {
      attendance.location = data.location;
    }

    if (data.notes !== undefined) {
      attendance.notes = data.notes;
    }

    if (data.inOffice !== undefined) {
      attendance.inOffice = data.inOffice;
    }

    let checkIn = attendance.checkIn;
    let checkOut = attendance.checkOut;

    if (data.checkIn) {
      checkIn = new Date(`${attendance.date}T${data.checkIn}:00`);
      attendance.checkIn = checkIn;
    }

    if (data.checkOut) {
      checkOut = new Date(`${attendance.date}T${data.checkOut}:00`);
      attendance.checkOut = checkOut;
    }

    if (checkIn && checkOut) {

      const officeHours =
        (checkOut.getTime() - checkIn.getTime()) /
        (1000 * 60 * 60);

      attendance.officeHours = officeHours;
      attendance.workingHours = officeHours;
      attendance.effectiveHours = officeHours;
    } else {

      attendance.officeHours = 0;
      attendance.workingHours = 0;
      attendance.effectiveHours = 0;
    }

    await attendance.save();
    await notificationService.sendToUser({
      userId: attendance.userId,
      title: "Attendance Updated",
      body: `Your attendance for ${attendance.date} has been updated.`,
      type: "ATTENDANCE",
      referenceId: attendance.id,
    });
    return {
      success: true,
      message: "Attendance updated successfully.",
      attendance,
    };
  };

  public getAttendanceById = async (id: number) => {
    const attendance = await Attendance.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });

    if (!attendance) {
      throw new Error("Attendance not found");
    }

    return {
      attendance,
      employee: attendance,
    };
  };
}

export default new AdminService();