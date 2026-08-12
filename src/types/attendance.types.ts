export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  HALFDAY = 'halfday',
  LEAVE = 'leave',
  AUTO_PUNCH_OUT = 'auto-punch-out',
  HOLIDAY = 'holiday',
  WORK_FROM_HOME = 'work-from-home',
}

export interface AttendanceItem {
  status: 'present' | 'absent' | 'leave' | 'wfh' | 'halfday';
}