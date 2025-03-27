import { StreakType } from "@/types/metrics-type";

export const calculateStreak = (
    streakType: StreakType,
    lastCompletedDate: Date,
    currentStreak: number,
    completed: boolean
): number => {
    if (!completed) return 0;

    if (currentStreak === 0) return 1;

    const today = new Date();
    const lastDate = new Date(lastCompletedDate);

    switch (streakType) {
        case "daily": {
            const todayDate = today.toISOString().split("T")[0];
            const lastDateStr = lastDate.toISOString().split("T")[0];

            if (todayDate === lastDateStr) {
                return currentStreak;
            }

            const diffInDays = Math.floor(
                (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            return diffInDays === 1 ? currentStreak + 1 : 1;
        }

        case "weekly": {
            const lastWeek = getWeekNumber(lastDate);
            const thisWeek = getWeekNumber(today);

            if (thisWeek === lastWeek) {
                return currentStreak;
            }
            const weekDiff = thisWeek - lastWeek;
            return weekDiff === 1 ? currentStreak + 1 : 1;
        }

        case "monthly": {
            const thisMonth = today.getMonth() + today.getFullYear() * 12;
            const lastMonth = lastDate.getMonth() + lastDate.getFullYear() * 12;

            if (thisMonth === lastMonth) {
                return currentStreak;
            }
            const monthDiff = thisMonth - lastMonth;
            return monthDiff === 1 ? currentStreak + 1 : 1;
        }

        case "annually": {
            const thisYear = today.getFullYear();
            const lastYear = lastDate.getFullYear();

            if (thisYear === lastYear) {
                return currentStreak;
            }
            const yearDiff = thisYear - lastYear;
            return yearDiff === 1 ? currentStreak + 1 : 1;
        }

        default:
            return 0;
    }
};

const getWeekNumber = (date: Date): number => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};
