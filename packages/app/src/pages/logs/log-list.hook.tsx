import { Status } from '@abyss/ui-components';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useScanLogs } from '../../state/database-access-utils';
import { formatDuration } from '../../utils/time';

export function useLogList() {
    const navigate = useNavigate();
    const logs = useScanLogs();

    const breadcrumbs = [
        { name: 'Home', onClick: () => navigate('/') },
        { name: 'Logs', onClick: () => navigate('/logs') },
    ];

    const logsTableData = useMemo(() => {
        const results: Record<string, any>[] = [];
        for (const log of logs.data || []) {
            results.push({
                status: <Status status={log.status} />,
                start: new Date(log.createdAt).toLocaleString(),
                duration: log.completedAt ? formatDuration(log.completedAt - log.createdAt) : 'ongoing',
                agent: log.sourceId,
                log: log.id,
            });
        }
        return results;
    }, [logs.data]);

    const onOpenRecordStr = (record: string) => {
        if (record.startsWith('logStream::')) {
            navigate(`/logs/id/${record}`);
        } else if (record.startsWith('agentGraph::')) {
            navigate(`/agents/id/${record}`);
        }
    };

    return { logs, breadcrumbs, logsTableData, onOpenRecordStr };
}
