import { Request, Response } from 'express';
import adminService from '../services/admin.service';
import { AuthRequest } from '../types/auth.types';

class AdminController {

  public getEmployees = async (req: AuthRequest, res: Response) => {
    try {
      const result = await adminService.getEmployees(req.query);
      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error?.message || 'Internal Server Error',
      });
    }
  };

  public createEmployee = async (req: AuthRequest, res: Response) => {
    try {
      const result = await adminService.createEmployee(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  public getEmployeeAttendance = async (req: AuthRequest, res: Response
  ) => {
    try {
      const employeeId = req.params.employeeId!;
      const attendance = await adminService.getEmployeeAttendance(employeeId);

      return res.status(200).json({
        success: true,
        attendance,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  public getAttendanceStatus = async (req: AuthRequest, res: Response) => {
    try {
      const employeeId = req.params.employeeId!;
      const { month, year } = req.query as any;
      const result = await adminService.getAttendanceStatus(employeeId, { month, year, });
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  public getEmployeeDetails = async (req: AuthRequest, res: Response) => {
    try {
      const employeeId = req.params.employeeId!;
      const result = await adminService.getEmployeeDetails(employeeId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  public editEmployeesDetails = async (req: AuthRequest, res: Response) => {
    try {
      const id = req.params.id!;
      const result = await adminService.editEmployeesDetails(id, req.body);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  public deleteEmployee = async (req: AuthRequest, res: Response) => {
    try {
      const id = req.params.id!;
      const result = await adminService.deleteEmployee(id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  public getEmployeeDocuments = async (req: AuthRequest, res: Response) => {
    try {
      const id = Number(req.params.id);
      const result = await adminService.getEmployeeDocuments(id);
      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  public createAttendance = async (req: Request, res: Response) => {
    try {
      const result = await adminService.createAttendance(req.body);

      return res.status(201).json({
        success: true,
        message: "Attendance added successfully.",
        attendance: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  public updateAttendance = async (req: Request, res: Response) => {
    try {
      const result = await adminService.updateAttendance(
        Number(req.params.id),
        req.body
      );

      return res.status(200).json({
        success: true,
        message: "Attendance updated successfully.",
        attendance: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  public getAttendanceById = async (req: Request, res: Response) => {
    try {
      const attendance = await adminService.getAttendanceById(
        Number(req.params.id)
      );

      res.json({
        success: true,
        attendance: attendance.attendance,
        employee: attendance.employee,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}

export default new AdminController();