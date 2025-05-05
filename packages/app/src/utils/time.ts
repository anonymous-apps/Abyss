const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60;
const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24;
const SECONDS_IN_MONTH = SECONDS_IN_DAY * 30;
const SECONDS_IN_YEAR = SECONDS_IN_DAY * 365;

export function formatDuration(ms: number) {
    let base = Math.floor(ms / 1000);

    const years = Math.floor(base / SECONDS_IN_YEAR);
    base = base - years * SECONDS_IN_YEAR;

    const months = Math.floor(base / SECONDS_IN_MONTH);
    base = base - months * SECONDS_IN_MONTH;

    const days = Math.floor(base / SECONDS_IN_DAY);
    base = base - days * SECONDS_IN_DAY;

    const hours = Math.floor(base / SECONDS_IN_HOUR);
    base = base - hours * SECONDS_IN_HOUR;

    const minutes = Math.floor(base / SECONDS_IN_MINUTE);
    base = base - minutes * SECONDS_IN_MINUTE;

    const seconds = base;

    if (years > 0) {
        return `${years} years`;
    }
    if (months > 0) {
        return `${months} months`;
    }
    if (days > 0) {
        return `${days} days`;
    }
    if (hours > 0) {
        return `${hours} hours`;
    }
    if (minutes > 0) {
        return `${minutes} minutes`;
    }
    if (seconds > 0) {
        return `${seconds} seconds`;
    }
    return '<1 second';
}
