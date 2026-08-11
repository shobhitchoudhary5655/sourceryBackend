import { Request, Response } from 'express';
import { AuthRequest } from "../types/auth.types";
import holidayService from '../services/holiday.service';

class HolidayController {

  public getHolidays = async (req: Request, res: Response) => {
    try {
      const result = await holidayService.getHolidays();
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  public addHoliday = async (req: AuthRequest, res: Response) => {
    try {
      // const result = await holidayService.addHoliday(req.body);
      const result = await holidayService.addHoliday(req.user!.id, req.body);
      return res.status(201).json(result);
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  public deleteHoliday = async (req: Request, res: Response) => {
    try {
      const { id } = req.params as { id: string };
      const result = await holidayService.deleteHoliday(id);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
}

export default new HolidayController();
