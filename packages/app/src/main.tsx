import { PrismaConnection } from '@abyss/records';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { loadFromLastPage } from './state/page-history';
import './style.css';
// @ts-ignore
export const Database = window.sqlite as PrismaConnection;

// Reload the last page the user was on, start from there
loadFromLastPage(async () => {
    // await applyTheme();
    // await CaptureMetric.ApplicationOpened();
    // await CaptureMetric.SqliteSize();

    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
});
