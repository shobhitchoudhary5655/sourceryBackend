import { Request, Response } from 'express';
import authService from '../services/auth.service';

class AuthController {

  public login = async (req: Request, res: Response) => {
    try {
      const result = await authService.login(req.body);

      if (!result.success) {
        return res.status(401).json(result);
      }

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

}

export default new AuthController();
