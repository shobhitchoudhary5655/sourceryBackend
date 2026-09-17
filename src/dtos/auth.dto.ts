export interface LoginDTO {
  email: string;
  password: string;
  fcmToken?: string;
  platform: "web" | "mobile";
}

export interface ResetPasswordDTO {
    token: string;
    password: string;
}
