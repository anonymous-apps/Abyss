import { useNavigate } from 'react-router-dom';
import { Database } from '../../main';
import { useDatabaseQuery, useDatabaseTableSubscription } from '../../state/database-connection';

export function useDatabasePage() {
    const navigate = useNavigate();
    const openDbTable = (tableName: string) => navigate(`/database/id/${tableName}`);

    // Page metadata
    const pageTitle = 'Local Database Explorer';
    const pageBreadcrumbs = [
        { name: 'Home', onClick: () => navigate('/') },
        { name: 'Database', onClick: () => navigate('/database') },
    ];

    // Data fetching
    const userSettings = useDatabaseTableSubscription('UserSettings', async database => database.table.userSettings.get());
    const allTables = useDatabaseQuery(async database => database.describeTables());

    // Actions
    const openDbFolder = () => {
        // @ts-ignore
        window.fs.openDbFolder();
    };

    const bootstrapDB = () => {
        Database.bootstrap.bootstrapping.bootstrapDB();
    };

    return {
        pageTitle,
        pageBreadcrumbs,
        userSettings,
        allTables: allTables.data,
        openDbFolder,
        bootstrapDB,
        navigate,
        openDbTable,
    };
}
