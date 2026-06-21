import { Request, Response } from 'express';
import dashboardService from '../services/dashboard.service';

class DashboardController {

  public getDashboardStats = async (req: Request, res: Response) => {
    try {
      const result = await dashboardService.getDashboardStats();
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to load dashboard',
      });
    }
  };

}

export default new DashboardController();