import { useEffect } from 'react';
import { Database } from '../main';
import { useDatabaseTableSubscription } from './database-connection';

export async function applyTheme() {
    const userSettings = await Database.table.userSettings.get();
    document.documentElement.setAttribute('data-theme', userSettings.theme || 'abyss');
}

export async function useTheme() {
    const userSettings = useDatabaseTableSubscription('UserSettings', db => db.table.userSettings.get());
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', userSettings.data?.theme || 'abyss');
    }, [userSettings.data?.theme]);
}
