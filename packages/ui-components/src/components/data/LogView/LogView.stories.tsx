import type { Meta, StoryObj } from '@storybook/react';
import { type LogEntry, LogView } from './LogView';

const meta: Meta<typeof LogView> = {
    title: 'Data/LogView',
    component: LogView,
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof LogView>;

const baseTimestamp = new Date('2024-04-22T10:00:00Z').getTime();

const sampleLogs: LogEntry[] = [
    {
        level: 'INFO',
        timestamp: baseTimestamp,
        scope: 'System',
        message: 'Application started successfully',
        data: {
            version: '1.0.0',
            environment: 'production',
            uptime: 1000,
        },
    },
    {
        level: 'WARNING',
        timestamp: baseTimestamp + 5 * 60 * 1000,
        scope: 'Database',
        message: 'Connection pool running low',
        data: {
            currentConnections: 95,
            maxConnections: 100,
            lastReset: '2024-04-22T09:00:00Z',
        },
    },
    {
        level: 'ERROR',
        timestamp: baseTimestamp + 10 * 60 * 1000,
        scope: 'API',
        message: 'Failed to process request',
        data: {
            requestId: 'req-12345',
            endpoint: '/api/users',
            statusCode: 500,
            error: 'Database connection timeout',
        },
    },
    {
        level: 'DEBUG',
        timestamp: baseTimestamp + 15 * 60 * 1000,
        scope: 'Cache',
        message: 'Cache miss for key: user:123',
        data: {
            key: 'user:123',
            cacheSize: 1024,
            ttl: 3600,
        },
    },
];

export const Default: Story = {
    args: {
        logs: sampleLogs,
        startTime: baseTimestamp,
    },
};

export const Empty: Story = {
    args: {
        logs: [],
        startTime: baseTimestamp,
    },
};
