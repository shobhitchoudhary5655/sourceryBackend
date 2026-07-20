import Notification from "../models/Notification";

class NotificationDAO {

  public create = async (data: any) => {
    return await Notification.create(data);
  };

  public findById = async (id: number) => {
    return await Notification.findByPk(id);
  };

  public findByUserId = async (userId: number) => {
    return await Notification.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
  };

  public unreadCount = async (userId: number) => {
    return await Notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  };

  public markAsRead = async (
    id: number,
    userId: number,
  ) => {
    await Notification.update(
      {
        isRead: true,
      },
      {
        where: {
          id,
          userId,
        },
      },
    );
  };

  public markAllAsRead = async (userId: number) => {
    await Notification.update(
      {
        isRead: true,
      },
      {
        where: {
          userId,
        },
      },
    );
  };

  public delete = async (
    id: number,
    userId: number,
  ) => {
    return await Notification.destroy({
      where: {
        id,
        userId,
      },
    });
  };
}

export default new NotificationDAO();