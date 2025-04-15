import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useDatabaseQuery } from '../../state/database-connection';

export function useRecordPage() {
    const { id, recordId } = useParams();
    const path = useLocation();
    const navigate = useNavigate();

    const record = useDatabaseQuery(async database => database.table[id as keyof typeof database.table].getByRecordId(recordId as string));

    useEffect(() => {
        record.refetch();
    }, [path.pathname]);

    const breadcrumbs = [
        { name: 'Home', onClick: () => navigate('/') },
        { name: 'Database', onClick: () => navigate('/database') },
        { name: id!, onClick: () => navigate(`/database/id/${id}`) },
        { name: recordId!, onClick: () => navigate(`/database/id/${id}/record/${recordId}`) },
    ];

    return {
        record,
        breadcrumbs,
        type: recordId?.split(':')[0],
    };
}
