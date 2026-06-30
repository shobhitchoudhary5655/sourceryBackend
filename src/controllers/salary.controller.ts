import { Response } from 'express';
import salaryService from '../services/salary.service';
import { AuthRequest } from '../types/auth.types';

class SalaryController {

    public getSalaryList = async (req: AuthRequest, res: Response) => {
        try {
            const result = await salaryService.getSalaryList(req.query);
            return res.status(200).json({ success: true, ...result, });
        } catch (error: any) {
            console.error('GET SALARY ERROR', error);
            return res.status(500).json({ success: false, message: error.message || 'Internal Server Error', });
        }
    };

    public createSalary = async (req: AuthRequest, res: Response) => {
        try {
            const result = await salaryService.createSalary(req.body);
            return res.status(201).json(result);
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message, });
        }
    };

    public markSalaryPaid = async (req: AuthRequest, res: Response) => {
        try {
            const id = Number(req.params.id);
            const result = await salaryService.markSalaryPaid(id);
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message, });
        }

    };

    public getSalaryDetails = async (req: AuthRequest, res: Response) => {
        try {
            const id = Number(req.params.id);
            const result = await salaryService.getSalaryDetails(id);
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message, });
        }
    };

}

export default new SalaryController();