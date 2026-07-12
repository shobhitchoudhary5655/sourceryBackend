export interface CreateLeaveDto {
  userId: number;

  leaveType:
    | 'Casual'
    | 'Sick'
    | 'Paid'
    | 'Emergency';

  startDate: string;

  endDate: string;

  reason?: string;
}


export interface UpdateLeaveDto {
  leaveType?:
    | 'Casual'
    | 'Sick'
    | 'Paid'
    | 'Emergency';

  startDate?: string;

  endDate?: string;

  reason?: string;
}


export interface ApproveLeaveDto {
  approvedBy: number;
}


export interface RejectLeaveDto {
  approvedBy: number;

  rejectionReason: string;
}

export interface ApplyLeaveDTO {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface ApplyRequestDTO {
  requestType: 'leave' | 'wfh';
  leaveType?: 'Casual' | 'Sick' | 'Paid' | 'Birthday' | 'Emergency';
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface UpdateLeaveStatusDTO {
  status: 'approved' | 'rejected';
}

export interface IRequest {
  id: number;
  userId: number;

  requestType: 'leave' | 'wfh';

  leaveType?:
    | 'Casual'
    | 'Sick'
    | 'Paid'
    | 'Emergency';

  startDate: string;
  endDate: string;
  reason?: string;

  status: 'pending' | 'approved' | 'rejected';
}