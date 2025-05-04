import { SQliteClient } from '@abyss/records';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CaptureMetric } from './state/metrics';
import { loadFromLastPage } from './state/page-history';
import { applyTheme } from './state/theme-state';
import './style.css';

// @ts-ignore
export const Database = window['abyss-sqlite'] as SQliteClient;

// Reload the last page the user was on, start from there
async function main() {
    await Database.initialize();
    await Database.migrateAll();
    await loadFromLastPage();
    await applyTheme();
    await CaptureMetric.ApplicationOpened();

    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}

main();
