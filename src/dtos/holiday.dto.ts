export interface CreateHolidayDto {
  holidayName: string;
  date: string;
  holidayType:
  | "PUBLIC"
  | "SPECIAL_HOLIDAY"
  | "SPECIAL_WFH";
  description?: string;
  employeeIds?: number[];
}

export interface UpdateHolidayDto {
  holidayName?: string;
  date?: string;
  holidayType:
  | "PUBLIC"
  | "SPECIAL_HOLIDAY"
  | "SPECIAL_WFH";
  description?: string;
  employeeIds?: number[];
}