import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Database } from '../../main';
import { useAppUpdator } from '../../state/app-updater';
import { useTableRecordUserSettings } from '../../state/database-connection';
export function useSettingsPage() {
    // Navigation
    const navigate = useNavigate();
    const pageBreadcrumbs = [
        { name: 'Home', onClick: () => navigate('/') },
        { name: 'Settings', onClick: () => navigate('/settings') },
    ];

    // Settings
    const settings = useTableRecordUserSettings();

    // Theme
    const onChangeAppTheme = (theme: string) => {
        Database.table.userSettings.updateFirst({ theme });
    };

    // Updating
    const updates = useAppUpdator();

    useEffect(() => {
        updates.checkForUpdate();
    }, []);

    return { breadcrumbs: pageBreadcrumbs, record: settings.data, onChangeAppTheme, updates };
}
