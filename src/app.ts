import express, { Application, Request, Response, } from 'express';
import cors from 'cors';
import routes from './routes';
import sequelize, { connectDB, } from './config/database';
import { AttendanceStatusCron, } from './crons/AttendanceStatusCron';
// import { AutoPunchOutCron } from './crons/AutoPunchOutCron';
import { LeaveBalanceCron } from './crons/UpdateLeaveBalance';
import { GraceBalanceResetCron } from './crons/GraceBalanceCron';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initialize404();
    this.initializeDatabase();
    this.initializeCrons();
  }

  private initializeMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(
      express.urlencoded({
        extended: true,
      })
    );
  }

  private initializeRoutes(): void {
    this.app.get('/', (req: Request, res: Response) => {
      res.status(200).json({ success: true, message: 'Attendance API Running', });
    }
    );

    this.app.use('/api', routes);
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await connectDB();
      await sequelize.sync();
      console.log('✅ Database Synced');
    } catch (error) {
      console.error('❌ Database Connection Failed', error);
      process.exit(1);
    }
  }

  private initializeCrons(): void {
    const attendanceCron = new AttendanceStatusCron();
    // const punchOutCron = new AutoPunchOutCron();
    const leaveBalanceCron = new LeaveBalanceCron();
    const graceBalanceResetCron = new GraceBalanceResetCron();
    attendanceCron.start();
    // punchOutCron.start();
    leaveBalanceCron.start();
    graceBalanceResetCron.start();
    console.log('✅ Cron Jobs Started');
  }

  private initialize404(): void {
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({ success: false, message: 'Route Not Found', });
    }
    );
  }
}

export default new App().app;