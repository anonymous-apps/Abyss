import { useEffect } from 'react';
import { Database } from '../main';
import { useDatabaseSettings } from './database-access-utils';

export async function applyTheme() {
    const userSettings = await Database.table.settings.getSettings();
    document.documentElement.setAttribute('data-theme', userSettings.theme || 'abyss');
}

export async function useTheme() {
    const userSettings = useDatabaseSettings();
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', userSettings?.theme || 'abyss');
    }, [userSettings?.theme]);
}
