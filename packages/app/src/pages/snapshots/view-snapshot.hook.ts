import type { ChatSnapshot } from '@abyss/records/dist/records/chat-snapshot/chat-snapshot.type';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useDatabaseRecord } from '../../state/database-connection';

export function useSnapshotsPage() {
    const { id } = useParams();

    const snapshot = useDatabaseRecord<ChatSnapshot>('chatSnapshot', id);
    const [raw, setRaw] = useState<'raw' | 'parsed'>('parsed');

    const navigate = useNavigate();
    const pageBreadcrumbs = [
        { name: 'Home', onClick: () => navigate('/') },
        { name: 'Snapshots', onClick: () => navigate('/') },
        { name: snapshot?.id ?? 'Unknown', onClick: () => navigate(`/`) },
    ];

    return { breadcrumbs: pageBreadcrumbs, record: snapshot, raw, setRaw };
}
