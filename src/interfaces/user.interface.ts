export interface IUser {
  id: number;
  employeeId?: string;
  name: string;
  email: string;
  password: string;
  roleId: number;
  phone?: string;
  gender?: 'Male' | 'Female' | 'Other';
  dateOfBirth?: string;
  designation?: string;
  joiningDate?: string;
  workLocation?: string;
  employeeType?: 'Permanent' | 'Contract' | 'Intern';
  profileImage?: string;
  salary?: number | null;
  status: "Active" | "Inactive";
  clBalance?: number | null;
  slBalance?: number | null;
}