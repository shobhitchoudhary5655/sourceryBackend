import { Request, Response } from 'express';
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

  public addHoliday = async (req: Request, res: Response) => {
    try {
      const result = await holidayService.addHoliday(req.body);
      return res.status(201).json(result);
    } catch (error: any) {
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
