export interface ApplyRequestDTO {
  requestType: 'leave' | 'wfh';
  leaveType?: 'Casual' | 'Sick' | 'Paid' | 'Emergency';
  startDate: string;
  endDate: string;
  reason?: string;
}