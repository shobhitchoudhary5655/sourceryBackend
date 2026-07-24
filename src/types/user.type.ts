export interface UserWithRole {
    id: number;
    name: string;
    email: string;
    password: string;
    fcmToken?: string;
    fcmTokens?: string[];
    role: {
        id: number;
        name: string;
    };
}