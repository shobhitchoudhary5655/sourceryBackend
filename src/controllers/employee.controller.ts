import { Request, Response } from 'express';
import adminService from '../services/admin.service';
import { AuthRequest } from '../types/auth.types';
import EmployeeService from '../services/employee.service';

class EmployeeController {

    public getUpcomingHolidays = async (req: AuthRequest, res: Response) => {
        try {
            const holidays = await EmployeeService.getUpcomingHolidays();
            return res.status(200).json({
                success: true,
                holidays,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch upcoming holidays',
            });
        }
    };
}

export default new EmployeeController()