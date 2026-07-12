export interface IAttendance {
  id: number;
  userId: number;
  date: string;
  checkIn?: Date;
  checkOut?: Date;
  status:
  | 'present'
  | 'absent'
  | 'halfday'
  | 'leave'
  | 'birthday-leave'
  | 'auto-punch-out'
  | 'holiday'
  | 'weekly-off'
  | 'work-from-home';
  officeHours: number;
  workingHours: number;
  effectiveHours: number;
  breakMinutes: number;
  location?: string;
  notes?: string;
  latitude: number;
  longitude: number;
  inOffice: boolean;
}

export interface AttendanceCreation {
  userId: string;
  date: string;
  checkIn: Date;
  status: string;
}