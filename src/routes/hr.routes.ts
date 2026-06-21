import {Request,Response,Router,} from 'express';

class HrRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/',
      this.getHrRoute
    );
  }

  private getHrRoute(
    req: Request,
    res: Response
  ): void {
    res.json({
      message: 'HR Route',
    });
  }
}

export default new HrRoutes().router;