import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';
import type { PrismaAPI } from '../server/preload/database-connection';
import { loadFromLastPage } from './state/page-history';
import { applyTheme } from './state/theme-state';
// @ts-ignore
export const Database = window.prisma as PrismaAPI;

// Reload the last page the user was on, start from there
loadFromLastPage(async () => {
    await applyTheme();

    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
});
