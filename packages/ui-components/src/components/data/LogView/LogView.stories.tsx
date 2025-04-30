import type { Meta, StoryObj } from '@storybook/react';
import LogView, { LogEntry } from './LogView';

const meta: Meta<typeof LogView> = {
    title: 'Data/LogView',
    component: LogView,
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof LogView>;

const sampleLogs: LogEntry[] = [
    {
        level: 'INFO',
        startTime: '2024-04-22T10:00:00Z',
        scope: 'System',
        message: 'Application started successfully',
        metadata: {
            version: '1.0.0',
            environment: 'production',
            uptime: 1000,
        },
    },
    {
        level: 'WARNING',
        startTime: '2024-04-22T10:05:00Z',
        scope: 'Database',
        message: 'Connection pool running low',
        metadata: {
            currentConnections: 95,
            maxConnections: 100,
            lastReset: '2024-04-22T09:00:00Z',
        },
    },
    {
        level: 'ERROR',
        startTime: '2024-04-22T10:10:00Z',
        scope: 'API',
        message: 'Failed to process request',
        metadata: {
            requestId: 'req-12345',
            endpoint: '/api/users',
            statusCode: 500,
            error: 'Database connection timeout',
        },
    },
    {
        level: 'DEBUG',
        startTime: '2024-04-22T10:15:00Z',
        scope: 'Cache',
        message: 'Cache miss for key: user:123',
        metadata: {
            key: 'user:123',
            cacheSize: 1024,
            ttl: 3600,
        },
    },
];

export const Default: Story = {
    args: {
        logs: sampleLogs,
    },
};

export const Empty: Story = {
    args: {
        logs: [],
    },
};
