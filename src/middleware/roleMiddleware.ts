import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/auth.types';

class RoleMiddleware {
  public authorizeRoles =
    (...allowedRoles: string[]) =>
    (req: AuthRequest, res: Response, next: NextFunction): void => {
      try {
        const user = req.user;

        if (!user) {
          res.status(401).json({
            success: false,
            message: 'Unauthorized',
          });
          return;
        }

        if (!allowedRoles.includes(user.role)) {
          res.status(403).json({
            success: false,
            message: 'Forbidden: Access denied',
          });
          return;
        }

        next();
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Role check failed',
        });
      }
    };
}

export default new RoleMiddleware();