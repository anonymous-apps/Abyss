import { Button, ButtonGroup, IconSection, PageCrumbed } from '@abyss/ui-components';
import { ChartLine } from 'lucide-react';
import React from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useMetricsChart } from './metrics-chart.hook';
export function MetricsChartPage() {
    const {
        metricName,
        selectedTimeBucket,
        setSelectedTimeBucket,
        aggregationMethod,
        setAggregationMethod,
        processedData,
        timeBucketOptions,
        aggregationMethods,
        breadcrumbs,
    } = useMetricsChart();

    return (
        <PageCrumbed title={`Metric: ${metricName || ''}`} subtitle="Visualization of metric data over time" breadcrumbs={breadcrumbs}>
            <IconSection title="Metric Chart" icon={ChartLine} subtitle="Visualization of metric data over time">
                <div className="mb-4 flex flex-wrap gap-4 justify-between">
                    <div>
                        <label className="block text-sm font-medium text-text-500 mb-1">Time Range</label>
                        <ButtonGroup>
                            {timeBucketOptions.map(option => (
                                <Button
                                    key={option.value}
                                    isInactive={option.value !== selectedTimeBucket}
                                    variant="primary"
                                    onClick={() => setSelectedTimeBucket(option.value)}
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-500 mb-1">Aggregation Method</label>
                        <ButtonGroup>
                            {aggregationMethods.map(option => (
                                <Button
                                    key={option.value}
                                    isInactive={option.value !== aggregationMethod}
                                    variant="primary"
                                    onClick={() => setAggregationMethod(option.value)}
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </div>
                </div>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={processedData.chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-background-500)" />
                            <XAxis
                                dataKey="time"
                                angle={-15}
                                textAnchor="end"
                                height={70}
                                interval={Math.max(1, Math.floor(processedData.bucketKeys.length / 10))}
                                tick={{ fill: 'var(--color-text-300)' }}
                            />
                            <YAxis tickFormatter={(value: number) => value.toFixed(2)} tick={{ fill: 'var(--color-text-300)' }} />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '4px',
                                    backgroundColor: 'var(--color-background-500)',
                                    color: 'var(--color-text-500)',
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="var(--color-primary-500)"
                                activeDot={{ r: 8 }}
                                animationDuration={300}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </IconSection>
        </PageCrumbed>
    );
}
