import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Database } from '../../main';
import { useAppUpdator } from '../../state/app-updater';
import { useDatabaseSettings } from '../../state/database-access-utils';

export function useSettingsPage() {
    // Navigation
    const navigate = useNavigate();
    const pageBreadcrumbs = [
        { name: 'Home', onClick: () => navigate('/') },
        { name: 'Settings', onClick: () => navigate('/settings') },
    ];

    // Settings
    const settings = useDatabaseSettings();

    // Theme
    const onChangeAppTheme = (theme: string) => {
        Database.tables.settings.ref().update({ theme });
    };

    // Updating
    const updates = useAppUpdator();

    useEffect(() => {
        updates.checkForUpdate();
    }, []);

    // Version
    const [version, setVersion] = useState<string | undefined>(undefined);
    useEffect(() => {
        window['abyss-app'].getVersion().then(setVersion);
    }, []);

    return { breadcrumbs: pageBreadcrumbs, record: settings, onChangeAppTheme, updates, version };
}
