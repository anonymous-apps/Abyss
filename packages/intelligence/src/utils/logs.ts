// ANSI color codes
const colors = {
    gray: '\x1b[90m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    reset: '\x1b[0m',
};

export const Log = {
    log(prefix: string, message: string) {
        console.log(`${colors.gray}${prefix.padEnd(30)}${colors.reset} ${colors.blue}INFO${colors.reset} ${message}`);
    },

    debug(prefix: string, message: string) {
        console.debug(`${colors.gray}${prefix.padEnd(30)}${colors.reset} ${colors.gray}DEBG${colors.gray} ${message} ${colors.reset}`);
    },

    error(prefix: string, message: string) {
        console.error(`${colors.gray}${prefix.padEnd(30)}${colors.reset} ${colors.red}ERRR${colors.reset} ${message}`);
    },

    warn(prefix: string, message: string) {
        console.warn(`${colors.gray}${prefix.padEnd(30)}${colors.reset} ${colors.yellow}WARN${colors.reset} ${message}`);
    },
};
