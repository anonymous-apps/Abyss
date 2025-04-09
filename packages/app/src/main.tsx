import React from 'react';
import ReactDOM from 'react-dom/client';
import type { PrismaAPI } from '../server/preload/database-connection';
import App from './App';
import { CaptureMetric } from './state/metrics';
import { loadFromLastPage } from './state/page-history';
import { applyTheme } from './state/theme-state';
import './style.css';
// @ts-ignore
export const Database = window.prisma as PrismaAPI;

// Reload the last page the user was on, start from there
loadFromLastPage(async () => {
    await applyTheme();
    await CaptureMetric.ApplicationOpened();
    await CaptureMetric.SqliteSize();

    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
});
