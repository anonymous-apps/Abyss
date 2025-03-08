import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';
import type { PrismaAPI } from '../server/preload/database-connection';

// @ts-ignore
export const Database = window.prisma as PrismaAPI;

// Listen for URL changes and log them
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

// Set initial page
Database.table.userSettings.get().then(settings => {
    if (settings.lastPage) {
        window.history.pushState({}, '', settings.lastPage);
        console.log('Loading up last page', settings.lastPage);
    }

    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
});
