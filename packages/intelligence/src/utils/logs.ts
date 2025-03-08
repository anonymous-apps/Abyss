export type LogLevel = 'off' | 'default' | 'verbose';

let logLevel: LogLevel = 'default';

export function setLogLevel(level: LogLevel) {
    logLevel = level;
}

export function getLogLevel(): LogLevel {
    return logLevel;
}
export const Log = {
    log(message: string) {
        if (logLevel === 'off') return;
        console.log(message);
    },

    debug(message: string) {
        if (logLevel !== 'verbose') return;
        console.debug(message);
    },

    error(message: string) {
        if (logLevel === 'off') return;
        console.error(message);
    },

    warn(message: string) {
        if (logLevel === 'off') return;
        console.warn(message);
    },
};
