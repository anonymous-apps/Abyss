import { Meta, StoryObj } from '@storybook/react';
import { Copy, FileJson, RefreshCw, Undo2 } from 'lucide-react';
import ChatToolCall from './ChatToolCall';

// Meta information for the component
const meta: Meta<typeof ChatToolCall> = {
    title: 'Chat Components/ChatToolCall',
    component: ChatToolCall,
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        toolName: {
            control: 'text',
        },
        status: {
            control: 'select',
            options: ['idle', 'running', 'complete', 'failed'],
        },
        inputData: {
            control: 'object',
        },
        outputText: {
            control: 'text',
        },
        onInvoke: { action: 'invoked' },
        actionItems: { control: 'object' },
    },
};

export default meta;
type Story = StoryObj<typeof ChatToolCall>;

// Default action items for stories
const defaultActionItems = [
    {
        icon: Copy,
        tooltip: 'Copy to clipboard',
        onClick: () => console.log('Copy clicked'),
    },
    {
        icon: FileJson,
        tooltip: 'Export as JSON',
        onClick: () => console.log('Export clicked'),
    },
];

// Not invoked tool
export const Idle: Story = {
    args: {
        toolName: 'list-files',
        status: 'idle',
        inputData: {
            path: '/home/user/documents',
            includeHidden: false,
        },
        actionItems: defaultActionItems,
    },
};

// Running tool
export const Running: Story = {
    args: {
        toolName: 'search-database',
        status: 'running',
        inputData: {
            query: 'SELECT * FROM users WHERE active = true',
            limit: 10,
        },
        actionItems: [
            ...defaultActionItems,
            {
                icon: Undo2,
                tooltip: 'Cancel operation',
                onClick: () => console.log('Cancel clicked'),
            },
        ],
    },
};

// Successful tool execution
export const Complete: Story = {
    args: {
        toolName: 'execute-command',
        status: 'complete',
        inputData: {
            command: 'echo "Hello World"',
            timeout: 5000,
        },
        outputText: 'Hello World\nCommand executed successfully with exit code 0.',
        actionItems: defaultActionItems,
    },
};

// Failed tool execution
export const Failed: Story = {
    args: {
        toolName: 'fetch-api-data',
        status: 'failed',
        inputData: {
            url: 'https://api.example.com/data',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        },
        outputText: 'Error: Failed to fetch data from API\nHTTP Status: 404\nMessage: Resource not found',
        actionItems: [
            ...defaultActionItems,
            {
                icon: RefreshCw,
                tooltip: 'Retry operation',
                onClick: () => console.log('Retry clicked'),
            },
        ],
    },
};

// Complex JSON input
export const ComplexInput: Story = {
    args: {
        toolName: 'transform-data',
        status: 'complete',
        inputData: {
            data: {
                users: [
                    { id: 1, name: 'John Doe', roles: ['admin', 'user'] },
                    { id: 2, name: 'Jane Smith', roles: ['user'] },
                ],
                settings: {
                    theme: 'dark',
                    notifications: {
                        email: true,
                        push: false,
                    },
                },
                metadata: {
                    version: '1.0.0',
                    lastUpdated: '2023-06-15T14:30:00Z',
                },
            },
            transformations: ['lowercase', 'remove-nulls'],
        },
        outputText: 'Transformation complete. 3 objects processed.',
        actionItems: defaultActionItems,
    },
};
