import { Role } from '../models';

export interface UserWithRole {
  id: string;
  name: string;
  email: string;
  password: string;

  role: {
    id: string;
    name: string;
  };
}