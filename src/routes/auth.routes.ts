import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

class AuthRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/login',
      AuthController.login
    );
  }
}

export default new AuthRoutes().router;