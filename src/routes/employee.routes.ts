import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import AttendanceController from '../controllers/attendance.controller';
import LeaveController from '../controllers/leave.controller';
import EmployeeController from '../controllers/employee.controller';
import SalaryController from '../controllers/salary.controller';

class EmployeeRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {

    this.router.post(
      '/punch-in',
      authMiddleware.verifyToken,
      AttendanceController.punchIn
    );

    this.router.post(
      '/punch-out',
      authMiddleware.verifyToken,
      AttendanceController.punchOut
    );

    this.router.get(
      '/my-attendance',
      authMiddleware.verifyToken,
      AttendanceController.getMyAttendance
    );

    this.router.get(
      '/',
      authMiddleware.verifyToken,
      AttendanceController.getAttendance
    );

    this.router.get(
      '/today-status',
      authMiddleware.verifyToken,
      AttendanceController.getTodayStatus
    );

    this.router.get(
      '/myOverall-status',
      authMiddleware.verifyToken,
      AttendanceController.getOverallStatus
    );

    this.router.post(
      '/applyLeave',
      authMiddleware.verifyToken,
      LeaveController.applyLeave
    );

    this.router.get(
      '/getMyLeaves',
      authMiddleware.verifyToken,
      LeaveController.getMyLeaves
    );

    this.router.get(
      '/upcoming-holidays',
      authMiddleware.verifyToken,
      EmployeeController.getUpcomingHolidays
    );

    this.router.patch(
      "/request/:id/cancel",
      authMiddleware.verifyToken,
      LeaveController.cancelRequest
    );

    this.router.get(
      "/mySalary",
      authMiddleware.verifyToken,
      SalaryController.getMySalaryHistory
    );

    this.router.get(
      "/mySalary/:id",
      authMiddleware.verifyToken,
      SalaryController.getMySalaryDetails
    );

    this.router.get(
      "/mySalary/:id/slip",
      authMiddleware.verifyToken,
      SalaryController.downloadSalarySlip
    );
  }
}

export default new EmployeeRoutes().router;
// const router = express.Router()

// const {applyLeave} = require('../controllers/leaveController');
// const authMiddleware = require('../middleware/authMiddleware');
// const {getMyLeaves} = require('../controllers/leaveController')
// const {punchIn,punchOut,getMyAttendance,getAttendance,getTodayStatus, getMyOverallAttendanceStatus} = require('../controllers/attendanceController');

// router.post('/punch-in',authMiddleware,punchIn);
// router.post('/punch-out',authMiddleware,punchOut);
// router.get('/my-attendance',authMiddleware,getMyAttendance);
// router.get('/',authMiddleware,getAttendance);
// router.get('/today-status',authMiddleware,getTodayStatus);
// router.get('/myOverall-status',authMiddleware,getMyOverallAttendanceStatus);
// router.post('/applyLeave',authMiddleware,applyLeave)
// router.get('/getMyLeaves',authMiddleware,getMyLeaves)

// module.exports =  router;