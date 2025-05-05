import { formatDistanceToNow } from 'date-fns';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabaseTableQuery } from '../../state/database-connection';

export function useMetrics() {
    const navigate = useNavigate();
    const metrics = useDatabaseTableQuery('metric', async database => database.tables.metric.list(10));
    const uniqueMetricNames = useDatabaseTableQuery('metric', async database => database.tables.metric.getUniqueNames());
    const [search, setSearch] = useState('');

    const renderableRows =
        useMemo(() => {
            return metrics.data?.map(metric => ({
                time: formatDistanceToNow(metric.createdAt),
                name: metric.name,
                value: metric.value,
                dimensions: Object.keys(metric.dimensionData || {}).join(', '),
                'Graph it': `/metrics/graph/${metric.name}`,
            }));
        }, [metrics.data]) || [];

    const filteredRenderableMetricNames = useMemo(() => {
        return uniqueMetricNames.data?.filter(name => name.toLowerCase().includes(search.toLowerCase())) || [];
    }, [uniqueMetricNames.data, search]);

    return {
        metrics,
        uniqueMetricNames,
        renderableRows,
        navigate,
        filteredRenderableMetricNames,
        search,
        setSearch,
    };
}
