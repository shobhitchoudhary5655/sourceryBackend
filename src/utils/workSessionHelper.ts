import { IWorkSession } from "../interfaces/attendance.interface";
import { Attendance } from "../models";

export const calculateWorkSessionMinutes = (sessions: IWorkSession[]): number => {

    if (!sessions?.length) {
        return 0;
    }

    return sessions.reduce((total, session) => {

        if (!session.startTime || !session.endTime) {
            return total;
        }

        const start = new Date(session.startTime).getTime();

        const end = new Date(session.endTime).getTime();

        const minutes = Math.floor((end - start) / (1000 * 60));

        return total + minutes;

    }, 0);

};

export const calculateAttendanceMetrics = (attendance: Attendance, extraBreakMinutes: number) => {
    const grossMinutes = Math.floor((new Date(attendance.checkOut!).getTime() - new Date(attendance.checkIn!).getTime()) / (1000 * 60));

    const workedMinutes = calculateWorkSessionMinutes(   attendance.workSessions );

    const pausedMinutes = grossMinutes - workedMinutes;

    const payableMinutes = workedMinutes - extraBreakMinutes;

    return {
        grossMinutes,
        workedMinutes,
        pausedMinutes,
        payableMinutes,
    };
};


export const calculateWorkSessionMinute = (
    sessions: any[]
): number => {
    let total = 0;

    for (const session of sessions) {
        if (!session.startTime || !session.endTime) {
            continue;
        }

        const start = new Date(session.startTime).getTime();
        const end = new Date(session.endTime).getTime();

        total += Math.floor((end - start) / (1000 * 60));
    }

    return total;
};