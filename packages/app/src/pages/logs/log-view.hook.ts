import { LogStreamType } from '@abyss/records';
import { useNavigate, useParams } from 'react-router';
import { useDatabaseRecord } from '../../state/database-connection';

export function useLogView() {
    const { id } = useParams();
    const navigate = useNavigate();

    const execution = useDatabaseRecord<LogStreamType>('logStream', id);

    const breadcrumbs = [
        { name: 'Home', onClick: () => navigate('/') },
        { name: 'Logs', onClick: () => navigate('/logs') },
        { name: execution?.id!, onClick: () => navigate(`/logs/id/${execution?.id}`) },
    ];
    return { execution, breadcrumbs };
}
