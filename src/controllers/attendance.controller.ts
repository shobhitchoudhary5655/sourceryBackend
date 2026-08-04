import { Response } from 'express';
import attendanceService from '../services/attendance.service';
import { AuthRequest } from '../types/auth.types';

class AttendanceController {

  public getTodayStatus = async (req: AuthRequest, res: Response) => {
    const result = await attendanceService.getTodayStatus(req.user!.id);
    return res.json(result);
  };

  public getAttendance = async (req: AuthRequest, res: Response) => {
    const result = await attendanceService.getAttendance();
    return res.json({ success: true, attendance: result });
  };

  public punchIn = async (req: AuthRequest, res: Response) => {
    const { latitude, longitude } = req.body;
    const result = await attendanceService.punchIn(req.user!.id, latitude, longitude);
    return res.json(result);
  };

  public punchOut = async (req: AuthRequest, res: Response) => {
    const { latitude, longitude } = req.body;
    const result = await attendanceService.punchOut(req.user!.id, latitude, longitude);
    return res.json(result);
  };

  public pauseAttendance = async (req: AuthRequest, res: Response) => {
    try {
      const result = await attendanceService.pauseAttendance(req.user!.id);

      if (!result.success) {
        // return responseHandler.error(res, result.message);
        res.status(500).json({ success: false, message: result.message });
      }
      // return responseHandler.success(res, result.message, result.attendance);
      res.status(200).json({ success: true, message: result.message });
    } catch (error: any) {
      // return responseHandler.serverError(res, error);
      res.status(500).json({ success: false, message: error.message });
    }

  };

  public resumeAttendance = async (req: AuthRequest, res: Response) => {
    try {
      const { latitude, longitude, } = req.body;
      const result = await attendanceService.resumeAttendance(req.user!.id, latitude, longitude);

      if (!result.success) {
        // return responseHandler.error(res, result.message);
        res.status(500).json({ success: false, message: result.message });
      }
      // return responseHandler.success(res, result.message, result.attendance);
      res.status(200).json({ success: true, message: result.message });
    } catch (error: any) {
      // return responseHandler.serverError(res, error);
      res.status(500).json({ success: false, message: error.message });
    }

  };

  public getMyAttendance = async (req: AuthRequest, res: Response) => {
    const month = Number(req.query.month);
    const year = Number(req.query.year);

    if (
      !Number.isInteger(month) ||
      !Number.isInteger(year) ||
      month < 1 ||
      month > 12
    ) {
      return res.status(400).json({
        success: false,
        message: 'Valid month and year are required',
        received: req.query,
      });
    }

    const result = await attendanceService.getMyAttendance(
      req.user!.id,
      month,
      year
    );

    return res.json(result);
  };
  public getOverallStatus = async (req: AuthRequest, res: Response) => {
    const month = Number(req.query.month);
    const year = Number(req.query.year);
    const result = await attendanceService.getOverallStatus(req.user!.id, month, year);
    return res.json(result);
  };

  public startBreak = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new Error("User not found");
    }
    const response = await attendanceService.startBreak(req.user.id);

    return res.json(response);
  };

  public endBreak = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new Error("User not found");
    }
    const response = await attendanceService.endBreak(req.user.id);

    return res.json(response);
  };

  public getBreakStatus = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new Error("User not found");
    }
    const response = await attendanceService.getBreakStatus(
      req.user.id
    );

    return res.json(response);
  };
}

export default new AttendanceController();
