export interface UserWithRole {
    id: number;
    name: string;
    email: string;
    password: string;
    fcmToken?: string | null;
    role: {
        id: number;
        name: string;
    };
}