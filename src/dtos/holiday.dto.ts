export interface CreateHolidayDto {
  holidayName: string;
  date: string;
}

export interface UpdateHolidayDto {
  holidayName?: string;
  date?: string;
}