import { WEEKLY_OFF_DAYS } from "../types/weeklyOff.types";
import { formatDate } from "./dateHelper";

export const getWeeklyOffDates = (month: number, year: number): string[] => {
    const weeklyOffDates: string[] = [];
    const totalDays = new Date(year, month, 0).getDate();

    for (let day = 1; day <= totalDays; day++) {
        const date = new Date(
            year,
            month - 1,
            day
        );

        if (WEEKLY_OFF_DAYS.includes(date.getDay())) {
            weeklyOffDates.push(
                formatDate(date)
            );
        }
    }

    return weeklyOffDates;
};

export const isWeeklyOff = (  date: Date): boolean => {
  return WEEKLY_OFF_DAYS.includes(
    date.getDay()
  );
};