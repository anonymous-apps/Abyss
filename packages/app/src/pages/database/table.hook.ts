import { useNavigate, useParams } from 'react-router';
import { Database } from '../../main';
import { useDatabaseTableScan } from '../../state/database-access-utils';

export function useTable() {
    const navigate = useNavigate();
    const { id } = useParams();

    const scanTable = useDatabaseTableScan(id as keyof typeof Database.tables);

    const breadcrumbs = [
        { name: 'Home', onClick: () => navigate('/') },
        { name: 'Database', onClick: () => navigate('/database') },
        { name: id!, onClick: () => navigate(`/database/id/${id}`) },
    ];

    const onPurgeTable = () => {
        Database.tables[id as keyof typeof Database.tables].purgeAll();
    };

    const onOpenRecordStr = (record: string) => {
        const [recordTable, recordId] = record.toString().split('::');
        navigate(`/database/id/${recordTable}/record/${record}`);
    };

    return { table: id, data: scanTable.data, breadcrumbs, onPurgeTable, scanTable, onOpenRecordStr };
}
