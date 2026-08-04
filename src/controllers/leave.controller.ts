import { Request, Response } from 'express';
import leaveService from '../services/leave.service';
import { AuthRequest } from '../types/auth.types';

class LeaveController {

  public applyLeave = async (req: any, res: Response) => {
    try {
      const result = await leaveService.applyRequest(req.user.id, req.body);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  public getMyLeaves = async (req: any, res: Response) => {
    try {
      const result = await leaveService.getMyLeaves(req.user.id);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  public getAllLeaveRequest = async (req: Request, res: Response) => {
    try {
      const result = await leaveService.getAllLeaveRequests(req.query);

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error?.message || 'Internal Server Error',
      });
    }
  };

  public updateLeaveStatus = async (req: Request, res: Response) => {
    try {
      const result = await leaveService.updateLeaveStatus(Number(req.params.id), req.body);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  public cancelRequest = async (req: AuthRequest, res: Response) => {
    try {
      const result = await leaveService.cancelRequest(
        req.user!.id,
        Number(req.params.id)
      );

      return res.status(200).json(result);

    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

}

export default new LeaveController();