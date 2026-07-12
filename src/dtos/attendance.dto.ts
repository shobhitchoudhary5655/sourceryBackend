export interface AttendanceQueryDTO {
  month: number;
  year: number;
}

export interface CreateAttendanceDTO {
  userId: number;
  date: string;

  status:
    | "present"
    | "absent"
    | "leave"
    // | "birthday-leave"
    | "halfday"
    | "holiday"
    | "weekly-off"
    | "work-from-home";

  checkIn?: string;
  checkOut?: string;

  location?: string;

  inOffice?: boolean;

  notes?: string;
}

export interface UpdateAttendanceDTO {
  status?:
    | "present"
    | "absent"
    | "leave"
    // | "birthday-leave"
    | "halfday"
    | "holiday"
    | "weekly-off"
    | "work-from-home";

  checkIn?: string;

  checkOut?: string;

  location?: string;

  inOffice?: boolean;

  notes?: string;
}