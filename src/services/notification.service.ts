import { getMessaging } from "../notifications/firebase";
import NotificationDAO from "../daos/notification.dao";
import User from "../models/User";

class NotificationService {

  async sendToUser({ userId, title, body, type, referenceId, data = {}, }: any) {

        await NotificationDAO.create({ userId, title, body, type, referenceId, });

        const user = await User.findByPk(userId);

        if (!user?.fcmToken) {
            return;
        }

        await getMessaging().send({
            token: user.fcmToken,
            notification: {
                title,
                body,
            },
            data,
        });
    }
    
  public getMyNotifications = async (userId: number) => {

    const notifications =
      await NotificationDAO.findByUserId(userId);

    return {
      success: true,
      notifications,
    };
  };

  public unreadCount = async (userId: number) => {

    const count =
      await NotificationDAO.unreadCount(userId);

    return {
      success: true,
      count,
    };
  };

  public markAsRead = async (
    id: number,
    userId: number,
  ) => {

    const notification =
      await NotificationDAO.findById(id);

    if (!notification) {
      return {
        success: false,
        message: "Notification not found.",
      };
    }

    if (notification.userId !== userId) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    await NotificationDAO.markAsRead(id, userId);

    return {
      success: true,
      message: "Notification marked as read.",
    };
  };

  public markAllRead = async (userId: number) => {

    await NotificationDAO.markAllAsRead(userId);

    return {
      success: true,
      message: "All notifications marked as read.",
    };
  };

  public deleteNotification = async (
    id: number,
    userId: number,
  ) => {

    const notification =
      await NotificationDAO.findById(id);

    if (!notification) {
      return {
        success: false,
        message: "Notification not found.",
      };
    }

    if (notification.userId !== userId) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    await NotificationDAO.delete(id, userId);

    return {
      success: true,
      message: "Notification deleted successfully.",
    };
  };
}

export default new NotificationService();