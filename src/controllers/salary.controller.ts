import { Response } from 'express';
import salaryService from '../services/salary.service';
import { AuthRequest } from '../types/auth.types';

class SalaryController {

    public getSalaryList = async (req: AuthRequest, res: Response) => {
        try {
            const result = await salaryService.getSalaryList(req.query);
            return res.status(200).json({ success: true, ...result, });
        } catch (error: any) {
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

    public getMySalaryHistory = async (req: AuthRequest, res: Response) => {
        try {

            const userId = req.user!.id;
            const month = req.query.month ? Number(req.query.month) : undefined;
            const year = req.query.year ? Number(req.query.year) : undefined;
            const data = await salaryService.getMySalaryHistory(userId, month, year);
            return res.status(200).json({
                success: true,
                message: "Salary fetched successfully.",
                data
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };

    public getMySalaryDetails = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.id;
            const salaryId = Number(req.params.id);
            const salary = await salaryService.getMySalaryDetails(userId, salaryId);
            return res.status(200).json({
                success: true,
                message: "Salary details fetched successfully.",
                data: salary
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };

    public downloadSalarySlip = async (
        req: AuthRequest,
        res: Response
    ) => {

        try {

            const userId = req.user!.id;

            const salaryId = Number(req.params.id);

            await salaryService.downloadSalarySlip(
                userId,
                salaryId,
                res
            );

        } catch (error: any) {
            if (!res.headersSent) {

                return res.status(400).json({
                    success: false,
                    message: error.message,
                });

            }

        }

    };

}

export default new SalaryController();