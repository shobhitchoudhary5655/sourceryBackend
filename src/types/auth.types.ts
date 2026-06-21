import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };

  params: {
    employeeId?: string;
    id?: string;
  };

  query: {
    month?: string;
    year?: string;
    search?: string;
    designation?: string;
    page?: string;
    limit?: string;
  };
}