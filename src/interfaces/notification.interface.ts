export interface INotification {
    id: number;

    userId: number;

    title: string;

    body: string;

    type:
    "LEAVE"
    | "LEAVE_REQUEST"
    | "WFH"
    | "ATTENDANCE"
    | "BIRTHDAY"
    | "ANNOUNCEMENT"
    | "SALARY"
    | "DOCUMENT"
    | "HOLIDAY"
    | "GENERAL";

    referenceId?: number | null;

    isRead: boolean;

    createdAt?: Date;

    updatedAt?: Date;
}

export interface PushNotificationPayload {
    token: string;

    title: string;

    body: string;

    data?: Record<string, string>;
}