import { Router } from 'express';

import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';
import hrRoutes from './hr.routes';
import employeeRoutes from './employee.routes';
import uploadRoutes from './upload.routes';
import notificationRoutes from './notification.routes';

export class AppRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use('/auth', authRoutes);
    this.router.use('/admin', adminRoutes);
    this.router.use('/hr', hrRoutes);
    this.router.use('/employee', employeeRoutes);
    this.router.use('/upload',uploadRoutes)
    this.router.use('/notification',notificationRoutes)
  }
}

export default new AppRoutes().router;