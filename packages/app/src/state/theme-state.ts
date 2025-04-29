import { useEffect } from 'react';
import { Database } from '../main';
import { useDatabaseTableQuery } from './database-connection';

export async function applyTheme() {
    const userSettings = await Database.table.userSettings.get();
    document.documentElement.setAttribute('data-theme', userSettings.theme || 'abyss');
}

export async function useTheme() {
    const userSettings = useDatabaseTableQuery('UserSettings', db => db.table.userSettings.get());
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', userSettings.data?.theme || 'etherial');
    }, [userSettings.data?.theme]);
}
