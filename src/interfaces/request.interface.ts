export interface IRequest {
    id: number;
    userId: number;
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
    | 'rejected';
    approvedBy?: number;
    approvedAt?: Date;
    rejectionReason?: string;
    createdAt?: Date;
    updatedAt?: Date;
}