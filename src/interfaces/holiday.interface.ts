export interface IHoliday {
  id: number;
  holidayName: string;
  date: string;
  holidayType:
  | "PUBLIC"
  | "SPECIAL_HOLIDAY"
  | "SPECIAL_WFH";
  description?: string;
  createdBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
}