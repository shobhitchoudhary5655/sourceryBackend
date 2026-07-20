import { Router } from 'express';
import notificationController from '../controllers/notification.controller';
import authMiddleware from '../middleware/authMiddleware';

class NotificationRoutes {
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {

        this.router.get(
            "/",
            authMiddleware.verifyToken,
            notificationController.getMyNotifications,
        );

        this.router.get(
            "/unread-count",
            authMiddleware.verifyToken,
            notificationController.unreadCount,
        );

        this.router.patch(
            "/:id/read",
            authMiddleware.verifyToken,
            notificationController.markAsRead,
        );

        this.router.patch(
            "/read-all",
            authMiddleware.verifyToken,
            notificationController.markAllRead,
        );

        this.router.delete(
            "/:id",
            authMiddleware.verifyToken,
            notificationController.deleteNotification,
        );

    }

}

export default new NotificationRoutes().router;