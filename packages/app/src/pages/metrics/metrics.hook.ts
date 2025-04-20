import { formatDistanceToNow } from 'date-fns';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabaseTableSubscription } from '../../state/database-connection';

export function useMetrics() {
    const navigate = useNavigate();
    const metrics = useDatabaseTableSubscription('Metric', async database => database.table.metric.readLatest(100));
    const uniqueMetricNames = useDatabaseTableSubscription('Metric', async database => database.table.metric.getUniqueMetricNames());

    const renderableRows =
        useMemo(() => {
            return metrics.data?.map(metric => ({
                time: formatDistanceToNow(metric.createdAt),
                name: metric.name,
                value: metric.value,
                dimensions: Object.keys(metric.dimensions || {}).join(', '),
                'Graph it': `/metrics/graph/${metric.name}`,
            }));
        }, [metrics.data]) || [];

    return {
        metrics,
        uniqueMetricNames,
        renderableRows,
        navigate,
    };
}
