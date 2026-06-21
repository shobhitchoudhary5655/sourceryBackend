export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  HALFDAY = 'halfday',
  LEAVE = 'leave',
  AUTO_PUNCH_OUT = 'auto-punch-out',
  HOLIDAY = 'holiday',
  // WEEKLY_OFF = 'weekly-off',
  WORK_FROM_HOME = 'work-from-home',
}

export interface AttendanceItem {
  status: 'present' | 'absent' | 'leave' | 'wfh' | 'halfday';
}