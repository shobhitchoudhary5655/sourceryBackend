export interface IRequest {
    id: number;
    userId: number;
    requestGroupId: string;
    requestType:
    | 'leave'
    | 'wfh';
    leaveType?:
    | 'Casual'
    | 'Sick'
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
    createdAt?: Date;
    updatedAt?: Date;
}