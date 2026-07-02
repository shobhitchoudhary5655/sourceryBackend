import { Holiday } from "../models";
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

export const isWeeklyOff = (date: Date): boolean => {
    return WEEKLY_OFF_DAYS.includes(
        date.getDay()
    );
};

export const getWorkingDays = (month: number, year: number): number => {
    let workingDays = 0;
    const totalDays = new Date(year, month, 0).getDate();
    for (let day = 1; day <= totalDays; day++) {
        const date = new Date(year, month - 1, day);
        if (isWeeklyOff(date)) {
            continue;
        }
        workingDays++;
    }
    return workingDays;
};

export const getWorkingDaysBetween = async (startDate: Date, endDate: Date): Promise<number> => {
    let days = 0;
    let current = new Date(startDate);

    while (current <= endDate) {
        if (isWeeklyOff(current)) {
            current.setDate(current.getDate() + 1);
            continue;
        }
        const holiday = await Holiday.findOne({
            where: { date: formatDate(current), },
        });

        if (holiday) {
            current.setDate(current.getDate() + 1);
            continue;
        }
        days++;
        current.setDate(current.getDate() + 1);
    }
    return days;
};