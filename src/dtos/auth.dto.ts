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

export interface GoogleLoginDTO {
  token: string;
  fcmToken?: string;
  platform: "web";
}