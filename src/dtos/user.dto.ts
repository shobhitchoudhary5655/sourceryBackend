export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  roleId: number;
}

export interface UpdateUserDto {
  name?: string;
  phone?: string;
  designation?: string;
  workLocation?: string;
  profileImage?: string;
}

