import { useNavigate, useParams } from 'react-router';
import { Database } from '../../main';
import { useDatabaseTableSubscription } from '../../state/database-connection';

export function useTable() {
    const navigate = useNavigate();
    const { id } = useParams();

    const scanTable = useDatabaseTableSubscription(id as string, async database =>
        database.table[id as keyof typeof database.table].scanTable()
    );

    const breadcrumbs = [
        { name: 'Home', onClick: () => navigate('/') },
        { name: 'Database', onClick: () => navigate('/database') },
        { name: id!, onClick: () => navigate(`/database/id/${id}`) },
    ];

    const onPurgeTable = () => {
        Database.table[id as keyof typeof Database.table].removeAll();
    };

    const onOpenRecordStr = (record: string) => {
        const [recordTable, recordId] = record.toString().split('::');
        navigate(`/database/id/${recordTable}/record/${record}`);
    };

    return { table: id, data: scanTable.data, breadcrumbs, onPurgeTable, scanTable, onOpenRecordStr };
}
