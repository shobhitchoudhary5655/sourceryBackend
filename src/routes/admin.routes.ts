import { Router } from 'express';

import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';
import AdminController from '../controllers/admin.controller';
import DashboardController from '../controllers/dashboard.controller';
import LeaveController from '../controllers/leave.controller';
import RoleController from '../controllers/role.controller';
import HolidayController from '../controllers/holiday.controller';
import SalaryController from '../controllers/salary.controller';

class AdminRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/create-employee',
      authMiddleware.verifyToken,
      AdminController.createEmployee
    );

    this.router.get(
      '/employees',
      authMiddleware.verifyToken,
      AdminController.getEmployees
    );

    this.router.get(
      '/employee/:employeeId',
      authMiddleware.verifyToken,
      AdminController.getEmployeeAttendance
    );

    this.router.get(
      '/getDashboardDetails',
      authMiddleware.verifyToken,
      DashboardController.getDashboardStats
    );

    this.router.get(
      '/getAllLeaveRequest',
      authMiddleware.verifyToken,
      LeaveController.getAllLeaveRequest
    );

    this.router.get(
      '/getRole',
      authMiddleware.verifyToken,
      RoleController.getRoles
    );

    // this.router.patch(
    //   '/:id/acceptLeave',
    //   authMiddleware.verifyToken,
    //   LeaveController.acceptLeave
    // );

    // this.router.patch(
    //   '/:id/rejectLeave',
    //   authMiddleware.verifyToken,
    //   LeaveController.rejectLeave
    // );

    this.router.patch(
      '/:id/updateLeaveStatus/status',
      authMiddleware.verifyToken,
      LeaveController.updateLeaveStatus
    );

    this.router.get(
      '/getAttendanceStatus/:employeeId',
      authMiddleware.verifyToken,
      AdminController.getAttendanceStatus
    );

    this.router.get(
      '/getEmployeeDetails/:employeeId',
      authMiddleware.verifyToken,
      AdminController.getEmployeeDetails
    );

    this.router.put(
      '/editEmployeeDetails/:id',
      authMiddleware.verifyToken,
      AdminController.editEmployeesDetails
    );

    this.router.delete(
      '/deleteEmployee/:id',
      authMiddleware.verifyToken,
      AdminController.deleteEmployee
    );

    this.router.get(
      '/getHolidays',
      authMiddleware.verifyToken,
      HolidayController.getHolidays
    );

    this.router.post(
      '/addHoliday',
      authMiddleware.verifyToken,
      HolidayController.addHoliday
    );

    this.router.delete(
      '/deleteHoliday/:id',
      authMiddleware.verifyToken,
      HolidayController.deleteHoliday
    );

    this.router.get(
      '/salary',
      authMiddleware.verifyToken,
      SalaryController.getSalaryList
    );

    this.router.post(
      '/salary',
      authMiddleware.verifyToken,
      SalaryController.createSalary
    );

    this.router.patch(
      '/salary/:id/pay',
      authMiddleware.verifyToken,
      SalaryController.markSalaryPaid
    );

    this.router.get(
      '/salary/:id',
      authMiddleware.verifyToken,
      SalaryController.getSalaryDetails
    );

    this.router.get(
      "/employees/:id/documents",
      authMiddleware.verifyToken,
      AdminController.getEmployeeDocuments
    );

    this.router.post(
      "/attendance",
      authMiddleware.verifyToken,
      AdminController.createAttendance
    );

    this.router.get(
      "/attendance/:id",
      authMiddleware.verifyToken,
      AdminController.getAttendanceById
    );

    this.router.put(
      "/attendance/:id",
      authMiddleware.verifyToken,
      AdminController.updateAttendance
    );
  }
}

export default new AdminRoutes().router;