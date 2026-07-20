import { Response } from "express";
import notificationService from "../services/notification.service";
import { AuthRequest } from "../types/auth.types";

class NotificationController {

  public getMyNotifications = async (
    req: AuthRequest,
    res: Response,
  ) => {
    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result =
        await notificationService.getMyNotifications(req.user.id);

      return res.status(200).json(result);

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };

  public unreadCount = async (
    req: AuthRequest,
    res: Response,
  ) => {
    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result =
        await notificationService.unreadCount(req.user.id);

      return res.status(200).json(result);

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };

  public markAsRead = async (
    req: AuthRequest,
    res: Response,
  ) => {
    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result =
        await notificationService.markAsRead(
          Number(req.params.id),
          req.user.id,
        );

      return res.status(200).json(result);

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };

  public markAllRead = async (
    req: AuthRequest,
    res: Response,
  ) => {
    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result =
        await notificationService.markAllRead(req.user.id);

      return res.status(200).json(result);

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };

  public deleteNotification = async (
    req: AuthRequest,
    res: Response,
  ) => {
    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result =
        await notificationService.deleteNotification(
          Number(req.params.id),
          req.user.id,
        );

      return res.status(200).json(result);

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };
}

export default new NotificationController();