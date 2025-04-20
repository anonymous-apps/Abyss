import { Button, IconSection, Input, PageCrumbed, Table } from '@abyss/ui-components';
import { Binary, ChartLine } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useMetrics } from './metrics.hook';

export function MetricsPage() {
    const { uniqueMetricNames, renderableRows, navigate, filteredRenderableMetricNames, search, setSearch } = useMetrics();
    return (
        <PageCrumbed
            title="Metrics"
            subtitle="Metrics are collected and useful for tracking the performance of the application over time."
            breadcrumbs={[
                { name: 'Home', onClick: () => navigate('/') },
                { name: 'Metrics', onClick: () => navigate('/metrics') },
            ]}
        >
            <IconSection title="Search Available Metrics" icon={ChartLine}>
                <Input placeholder="Search for a metric" value={search} onChange={setSearch} />
                <div className="gap-2 h-[100px] overflow-y-auto bg-background-100 mt-2 rounded-md p-2">
                    {filteredRenderableMetricNames.map(name => (
                        <Button key={name} variant="secondary" onClick={() => navigate(`/metrics/graph/${name}`)} icon={Binary}>
                            {name.split('.').map(part => (
                                <span
                                    key={part}
                                    className={`text-text-300 text-sm bg-primary-100 px-1 ${
                                        part !== name.split('.').slice(-1)[0] ? 'border-r border-primary-200' : ''
                                    }`}
                                >
                                    {part}
                                </span>
                            ))}
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
