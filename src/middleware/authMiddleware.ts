import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types/auth.types';

class AuthMiddleware {
  public verifyToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Response | void => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: 'No Token Provided',
        });
      }

      let token: string;

      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      } else {
        token = authHeader;
      }

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Token Format',
        });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as {
        id: number;
        role: string;
      };

      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      next();

    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or Expired Token',
        error: error?.message,
      });
    }
  };
}

export default new AuthMiddleware();