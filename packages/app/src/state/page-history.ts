// Listen for URL changes and log them to database

import { Database } from '../main';

// This allows us to reboot the app and continue from the last page
let lastPage = window.location.pathname;
if (typeof window !== 'undefined') {
    const logPageChange = async () => {
        if (lastPage !== window.location.pathname) {
            Database.tables.settings.update({
                lastPage: window.location.pathname,
            });
            lastPage = window.location.pathname;
        }
    };
    setInterval(logPageChange, 1000);
}

// Set initial page and then call the handler
export async function loadFromLastPage() {
    const settings = await Database.tables.settings.default();
    window.history.pushState({}, '', settings.lastPage);
}
