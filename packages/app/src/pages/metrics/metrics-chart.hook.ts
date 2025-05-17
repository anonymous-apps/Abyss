import { addDays, addHours, addMinutes, format, subDays, subHours, subMonths } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDatabaseTableQuery } from '../../state/database-connection';

// Define time bucket options
export type TimeBucketOption = {
    label: string;
    value: string;
    getStartTime: () => Date;
    formatTime: (date: Date) => string;
    generateBucketKeys: () => string[];
    getBucketKey: (date: Date) => string;
    parseBucketKey: (key: string) => Date;
};

export const timeBucketOptions: TimeBucketOption[] = [
    {
        label: 'Last Hour',
        value: 'hour',
        getStartTime: () => subHours(new Date(), 1),
        formatTime: (date: Date) => format(date, 'HH:mm'),
        generateBucketKeys: () => {
            const now = new Date();
            const startTime = subHours(now, 1);
            const bucketKeys: string[] = [];

            let currentTime = startTime;
            while (currentTime <= now) {
                bucketKeys.push(format(currentTime, 'yyyy-MM-dd-HH-mm'));
                currentTime = addMinutes(currentTime, 1);
            }

            return bucketKeys;
        },
        getBucketKey: (date: Date) => format(date, 'yyyy-MM-dd-HH-mm'),
        parseBucketKey: (key: string) => {
            // Format: yyyy-MM-dd-HH-mm
            const [year, month, day, hour, minute] = key.split('-').map(Number);
            return new Date(year, month - 1, day, hour, minute);
        },
    },
    {
        label: 'Last Day',
        value: 'day',
        getStartTime: () => subDays(new Date(), 1),
        formatTime: (date: Date) => format(date, 'MMM d, HH:00'),
        generateBucketKeys: () => {
            const now = new Date();
            const startTime = subDays(now, 1);
            const bucketKeys: string[] = [];

            let currentTime = startTime;
            while (currentTime <= now) {
                bucketKeys.push(format(currentTime, 'yyyy-MM-dd-HH'));
                currentTime = addHours(currentTime, 1);
            }

            return bucketKeys;
        },
        getBucketKey: (date: Date) => format(date, 'yyyy-MM-dd-HH'),
        parseBucketKey: (key: string) => {
            // Format: yyyy-MM-dd-HH
            const [year, month, day, hour] = key.split('-').map(Number);
            return new Date(year, month - 1, day, hour);
        },
    },
    {
        label: 'Last Month',
        value: 'month',
        getStartTime: () => subMonths(new Date(), 1),
        formatTime: (date: Date) => format(date, 'MMM d'),
        generateBucketKeys: () => {
            const now = new Date();
            const startTime = subMonths(now, 1);
            const bucketKeys: string[] = [];

            let currentTime = startTime;
            while (currentTime <= now) {
                bucketKeys.push(format(currentTime, 'yyyy-MM-dd'));
                currentTime = addDays(currentTime, 1);
            }

            return bucketKeys;
        },
        getBucketKey: (date: Date) => format(date, 'yyyy-MM-dd'),
        parseBucketKey: (key: string) => {
            // Format: yyyy-MM-dd
            const [year, month, day] = key.split('-').map(Number);
            return new Date(year, month - 1, day);
        },
    },
];

// Define aggregation methods
export type AggregationMethod = 'sum' | 'average' | 'max' | 'min';

export const aggregationMethods = [
    { label: 'Average', value: 'average' as AggregationMethod },
    { label: 'Sum', value: 'sum' as AggregationMethod },
    { label: 'Maximum', value: 'max' as AggregationMethod },
    { label: 'Minimum', value: 'min' as AggregationMethod },
];

export function useMetricsChart() {
    const { metricName } = useParams<{ metricName: string }>();

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTimeBucket, setSelectedTimeBucket] = useState<string>('day');
    const [aggregationMethod, setAggregationMethod] = useState<AggregationMethod>('average');

    // Dimensions
    const [selectedDimensions, setSelectedDimensions] = useState<Record<string, any>>({});
    const uniqueDimensions = useDatabaseTableQuery('metric', async database =>
        database.tables.metric.getUniqueDimensionsForMetric(metricName || '')
    );

    // Fetch metrics data
    const metrics = useDatabaseTableQuery(
        'metric',
        async database => database.tables.metric.queryMetrics(metricName || '', selectedDimensions),
        [metricName]
    );

    // Navigation functions
    const navigateToHome = () => {
        navigate('/');
    };

    const navigateToMetrics = () => {
        navigate('/metrics');
    };

    const navigateToMetricChart = () => {
        navigate(`/metrics/graph/${metricName}`);
    };

    // Define breadcrumbs
    const breadcrumbs = [
        { name: 'Home', onClick: navigateToHome },
        { name: 'Metrics', onClick: navigateToMetrics },
        { name: metricName!, onClick: navigateToMetricChart },
    ];

    // Process data for the chart using useMemo
    const processedData = useMemo(() => {
        if (!metrics.data) return { chartData: [], bucketKeys: [] };

        // Get the selected time bucket option
        const timeBucketOption = timeBucketOptions.find(option => option.value === selectedTimeBucket) || timeBucketOptions[1];

        // Generate all valid bucket keys for the selected time range
        const validBucketKeys = timeBucketOption.generateBucketKeys();

        // Initialize buckets with empty arrays
        const buckets: Record<string, any[]> = {};
        validBucketKeys.forEach(key => {
            buckets[key] = [];
        });

        // Group data points into buckets
        metrics.data.forEach(metric => {
            const date = new Date(metric.createdAt);
            const bucketKey = timeBucketOption.getBucketKey(date);

            // Only include metrics that fit into one of our predefined buckets
            if (buckets[bucketKey]) {
                buckets[bucketKey].push(metric);
            }
        });

        // Compute aggregated values for each bucket
        const chartData = validBucketKeys.map(key => {
            const datapoints = buckets[key];
            if (datapoints.length === 0) {
                return {
                    time: timeBucketOption.formatTime(timeBucketOption.parseBucketKey(key)),
                    value: null,
                };
            }

            // Use the custom parser to correctly parse the bucket key
            const date = timeBucketOption.parseBucketKey(key);

            // Calculate aggregated value based on selected method
            let aggregatedValue = 0;

            if (datapoints.length > 0) {
                switch (aggregationMethod) {
                    case 'sum':
                        aggregatedValue = datapoints.reduce((sum, point) => sum + point.value, 0);
                        break;
                    case 'max':
                        aggregatedValue = Math.max(...datapoints.map(point => point.value));
                        break;
                    case 'min':
                        aggregatedValue = Math.min(...datapoints.map(point => point.value));
                        break;
                    case 'average':
                    default:
                        aggregatedValue = datapoints.reduce((sum, point) => sum + point.value, 0) / datapoints.length;
                        break;
                }
            }

            // Use dimensions from the first datapoint in the bucket if available
            const dimensions = datapoints.length > 0 ? { ...datapoints[0].dimensions } : {};

            return {
                time: timeBucketOption.formatTime(date),
                value: Math.round(aggregatedValue * 100) / 100,
                ...dimensions,
            };
        });

        return { chartData, bucketKeys: validBucketKeys };
    }, [metrics.data, selectedTimeBucket, aggregationMethod]);

    // Update loading state
    useEffect(() => {
        if (metrics.data) {
            setIsLoading(false);
        }

        if (metrics.error) {
            setError(metrics.error.message);
            setIsLoading(false);
        }
    }, [metrics.data, metrics.error]);

    return {
        metricName,
        isLoading,
        error,
        selectedTimeBucket,
        setSelectedTimeBucket,
        aggregationMethod,
        setAggregationMethod,
        processedData,
        timeBucketOptions,
        aggregationMethods,
        breadcrumbs,
        navigateToHome,
        navigateToMetrics,
        navigateToMetricChart,
        selectedDimensions,
        setSelectedDimensions,
        uniqueDimensions,
    };
}
