import { Meta, StoryObj } from '@storybook/react';
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
            options: ['not_invoked', 'running', 'success', 'failure'],
        },
        inputData: {
            control: 'object',
        },
        outputText: {
            control: 'text',
        },
        onInvoke: { action: 'invoked' },
    },
};

export default meta;
type Story = StoryObj<typeof ChatToolCall>;

// Not invoked tool
export const NotInvoked: Story = {
    args: {
        toolName: 'list-files',
        status: 'not_invoked',
        inputData: {
            path: '/home/user/documents',
            includeHidden: false,
        },
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
    },
};

// Successful tool execution
export const Success: Story = {
    args: {
        toolName: 'execute-command',
        status: 'success',
        inputData: {
            command: 'echo "Hello World"',
            timeout: 5000,
        },
        outputText: 'Hello World\nCommand executed successfully with exit code 0.',
    },
};

// Failed tool execution
export const Failure: Story = {
    args: {
        toolName: 'fetch-api-data',
        status: 'failure',
        inputData: {
            url: 'https://api.example.com/data',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        },
        outputText: 'Error: Failed to fetch data from API\nHTTP Status: 404\nMessage: Resource not found',
    },
};

// Complex JSON input
export const ComplexInput: Story = {
    args: {
        toolName: 'transform-data',
        status: 'success',
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
    },
};
