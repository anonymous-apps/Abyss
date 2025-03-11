import React from 'react';
import { Database } from '../main';

// Listen for URL changes and log them to database
// This allows us to reboot the app and continue from the last page
let lastPage = window.location.pathname;
if (typeof window !== 'undefined') {
    const logPageChange = () => {
        if (lastPage !== window.location.pathname) {
            Database.table.userSettings.update({
                lastPage: window.location.pathname,
            });
            lastPage = window.location.pathname;
        }
    };
    setInterval(logPageChange, 1000);
}

// Set initial page and then call the handler
export function loadFromLastPage(handler: () => void) {
    Database.table.userSettings.get().then(settings => {
        if (settings.lastPage) {
            window.history.pushState({}, '', settings.lastPage);
        }
        handler();
    });
}
