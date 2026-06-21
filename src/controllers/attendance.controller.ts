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
    const result = await attendanceService.punchIn(req.user!.id);
    return res.json(result);
  };

  public punchOut = async (req: AuthRequest, res: Response) => {
    const result = await attendanceService.punchOut(req.user!.id);
    return res.json(result);
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
    const result = await attendanceService.getOverallStatus(req.user!.id);
    return res.json(result);
  };
}

export default new AttendanceController();
