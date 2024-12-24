import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

export class TimeExtension {
    static ONE_SECOND_IN_MS = 1000;
    static ONE_MINUTE_IN_MS = 60 * this.ONE_SECOND_IN_MS;
    static ONE_HOUR_IN_MS = 60 * this.ONE_MINUTE_IN_MS;
    static ONE_DAY_IN_MS = 24 * this.ONE_HOUR_IN_MS;
    static ONE_WEEK_IN_MS = 7 * this.ONE_DAY_IN_MS;

    /**
     * Wait the time as delay.
     *
     * @param {number} ms - Waiting time in milliseconds.
     * @returns {void}
     */
    static async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Compare two dates whether the date1 is former date than the date2.
     *
     * @param {Date} date - Date.
     * @param {Date} compare - Target date to compare (default = now).
     * @returns {boolean} If date is former than compare, returns true. If not, returns false.
     */
    static isFormerDateThan(date: Date, compare: Date = new Date()): boolean {
        return new Date(date).getTime() < new Date(compare).getTime();
    }

    /**
     * Compare two dates whether the date1 is same date as the date2.
     *
     * @param {Date} date - Date.
     * @param {Date} compare - Target date to compare (default = now).
     * @returns {boolean} If date is same as compare, returns true. If not, returns false.
     */
    static isSameDate(date: Date, compare: Date = new Date()): boolean {
        return new Date(date).getTime() === new Date(compare).getTime();
    }

    /**
     * Compare two dates whether the date1 is later date than the date2.
     *
     * @param {Date} date - Date.
     * @param {Date} compare - Target date to compare (default = now).
     * @returns {boolean} If date is later than compare, returns true. If not, returns false.
     */
    static isLaterDateThan(date: Date, compare: Date = new Date()): boolean {
        return new Date(date).getTime() > new Date(compare).getTime();
    }

    /**
     * Check if the two dates are the same.
     *
     * @param {Date} date1 - Comparing date 1.
     * @param {Date} date2 - Comparing date 2.
     * @returns {boolean} True if the two dates are the same, if not, false.
     */
    static isEqualDate(date1: Date, date2: Date): boolean {
        return new Date(date1).getTime() === new Date(date2).getTime();
    }

    static addDays(date: Date, days: number): Date {
        return new Date(new Date(date).getTime() + this.ONE_DAY_IN_MS * days);
    }

    static isBetween(date: Date, start: Date, end: Date): boolean {
        const target = new Date(date).getTime();
        return (
            new Date(start).getTime() <= target &&
            target <= new Date(end).getTime()
        );
    }

    /**
     * Get the start and end time of today in KST.
     * @returns The dates of the start and end of today.
     */
    static getTodayString(input?: {
        tz?: "Asia/Seoul" | "UTC";
        format?: string;
    }): string {
        dayjs.extend(utc);
        dayjs.extend(timezone);
        return dayjs()
            .tz(input?.tz ?? "UTC")
            .format(input?.format ?? "YYYY-MM-DD HH:mm:ss");
    }

    static getTodayYYMMDD(): string {
        return this.getTodayString({
            tz: "Asia/Seoul",
            format: "YYMMDD",
        });
    }

    static getTodayYYYYMMDD(): string {
        return this.getTodayString({
            tz: "Asia/Seoul",
            format: "YYYYMMDD",
        });
    }

    static getCurrentHHMMSS(): string {
        return this.getTodayString({
            tz: "Asia/Seoul",
            format: "HHmmss",
        });
    }
}
