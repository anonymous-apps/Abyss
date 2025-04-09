import { formatDistanceToNow } from 'date-fns';
import { ChartLine, FileDigit } from 'lucide-react';
import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomTable } from '../../library/content/database-table';
import { IconSection } from '../../library/layout/icon-section';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { WithSidebar } from '../../library/layout/sidebar';
import { useDatabaseTableSubscription } from '../../state/database-connection';

export function MetricsPage() {
    const metrics = useDatabaseTableSubscription('Metric', async database => database.table.metric.readLatest(100));
    const uniqueMetricNames = useDatabaseTableSubscription('Metric', async database => database.table.metric.getUniqueMetricNames());
    const navigate = useNavigate();

    const renderableRows =
        useMemo(() => {
            return metrics.data?.map(metric => ({
                time: formatDistanceToNow(metric.createdAt),
                name: metric.name,
                value: metric.value,
                dimensions: Object.keys(metric.dimensions || {}).join(', '),
                'Graph it': (
                    <Link className="text-text-base underline hover:text-primary-base" to={`/metrics/graph/${metric.id}`}>
                        View in Graph
                    </Link>
                ),
            }));
        }, [metrics.data]) || [];

    return (
        <WithSidebar>
            <PageCrumbed
                title="Metrics"
                subtitle="Metrics are collected and useful for tracking the performance of the application over time."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Metrics', url: '/metrics' },
                ]}
            >
                <IconSection title="Available Metrics" icon={ChartLine}>
                    <div className="flex flex-wrap gap-5">
                        {uniqueMetricNames.data?.map(name => (
                            <Link
                                key={name as string}
                                to={`/metrics/graph/${name}`}
                                className="text-text-base underline hover:text-primary-base capitalize flex items-center"
                            >
                                <FileDigit size={16} className="mr-2" />
                                {name.split('-').join(' ')}
                            </Link>
                        ))}
                    </div>
                </IconSection>
                <IconSection
                    title="Recent Datapoints Collected"
                    icon={ChartLine}
                    subtitle="These are stored locally in SQLite and dont leave your device, but might be fun to look at."
                >
                    <div className="max-h-[500px] overflow-y-auto">
                        <CustomTable table="Metric" records={renderableRows as Record<string, any>[]} />
                    </div>
                </IconSection>
            </PageCrumbed>
        </WithSidebar>
    );
}
