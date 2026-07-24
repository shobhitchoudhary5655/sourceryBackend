import { getMessaging } from "../notifications/firebase";
import NotificationDAO from "../daos/notification.dao";
import User from "../models/User";

class NotificationService {

  public saveFCMToken = async (userId: number, token: string,) => {
    const user = await User.findByPk(userId);

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const tokens = user.fcmTokens || [];

    if (!tokens.includes(token)) {
      tokens.push(token);

      await user.update({ fcmTokens: tokens, });
    }

    return {
      success: true,
    };
  };

  public removeFCMToken = async (
    userId: number,
    token: string,
  ) => {

    const user = await User.findByPk(userId);

    if (!user) {
      return {
        success: false,
      };
    }

    const tokens = user.fcmTokens || [];

    await user.update({
      fcmTokens: tokens.filter(
        item => item !== token
      ),
    });

    return {
      success: true,
    };
  };
  async sendToUser({ userId, title, body, type, referenceId, data = {}, }: any) {

     console.log("USER ID:", userId);

    await NotificationDAO.create({ userId, title, body, type, referenceId, });

    const user = await User.findByPk(userId);

    console.log(
   "USER FCM TOKENS:",
   user?.fcmTokens
 );

    if (!user) {
      return;
    }

    const tokens = user.fcmTokens || [];

    if (tokens.length === 0) {
      return;
    }

    for (const token of tokens) {
       console.log(
    "SENDING FCM:",
    token
   );
      try {
        const result =await getMessaging().send({
          token,
          notification: {
            title,
            body,
          },
          data,
        });
        console.log(
      "FCM SUCCESS:",
      result
    );

      } catch (error) {
        console.error("Failed to send notification:", error);
      }
    }
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