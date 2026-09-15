export interface IRequest {
    id: number;
    userId: number;
    requestGroupId: string;
    requestType:
    | 'leave'
    | 'wfh'
    | "grace_balance";
    leaveType?:
    | 'Casual'
    | 'Sick'
    | 'Birthday'
    | 'Paid'
    | 'Emergency';
    startDate: string;
    endDate: string;
    reason?: string;
    status:
    | 'pending'
    | 'approved'
    | 'rejected'
    | "cancelled";
    approvedBy?: number;
    approvedAt?: Date;
    rejectionReason?: string;
    lopDays?: number;
    attendanceId?: number;
    extraMinutes?: number;
    createdAt?: Date;
    updatedAt?: Date;
}