import { Button, IconSection, PageCrumbed, Table } from '@abyss/ui-components';
import { Binary, ChartLine } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useMetrics } from './metrics.hook';

export function MetricsPage() {
    const { uniqueMetricNames, renderableRows, navigate } = useMetrics();

    return (
        <PageCrumbed
            title="Metrics"
            subtitle="Metrics are collected and useful for tracking the performance of the application over time."
            breadcrumbs={[
                { name: 'Home', onClick: () => navigate('/') },
                { name: 'Metrics', onClick: () => navigate('/metrics') },
            ]}
        >
            <IconSection title="Available Metrics" icon={ChartLine}>
                <div className="flex flex-wrap gap-5">
                    {uniqueMetricNames.data?.map(name => (
                        <Button key={name as string} variant="secondary" onClick={() => navigate(`/metrics/graph/${name}`)} icon={Binary}>
                            {name.split('-').join(' ')}
                        </Button>
                    ))}
                </div>
            </IconSection>
            <IconSection
                title="Recent Datapoints Collected"
                icon={ChartLine}
                subtitle="These are stored locally in SQLite and dont leave your device, but might be fun to look at."
            >
                <div className="max-h-[500px] overflow-y-auto">
                    <Table
                        table="Metric"
                        data={
                            renderableRows.map(row => ({
                                ...row,
                                'Graph it': (
                                    <Link className="text-text-300 underline hover:text-primary-300" to={row['Graph it']}>
                                        View in Graph
                                    </Link>
                                ),
                            })) as Record<string, any>[]
                        }
                    />
                </div>
            </IconSection>
        </PageCrumbed>
    );
}
