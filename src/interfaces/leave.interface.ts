export type LeaveType =
  | 'Casual'
  | 'Sick'
  | 'Paid'
  | 'Emergency';

export type LeaveStatus =
  | 'pending'
  | 'approved'
  | 'rejected';

export interface ILeave {
  id: number;

  userId: number;

  leaveType: LeaveType;

  startDate: string;

  endDate: string;

  reason?: string;

  status: LeaveStatus;

  approvedBy?: number;

  approvedAt?: Date;

  rejectionReason?: string;

  createdAt?: Date;

  updatedAt?: Date;
}