import type { Meta, StoryObj } from '@storybook/react';
import ChatMessageSystemError from './ChatMessageSystemError';

// Meta information for the component
const meta: Meta<typeof ChatMessageSystemError> = {
    title: 'Chat Components/ChatMessageSystemError',
    component: ChatMessageSystemError,
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        text: {
            control: 'text',
        },
    },
};

export default meta;
type Story = StoryObj<typeof ChatMessageSystemError>;

// Basic error message
export const BasicError: Story = {
    args: {
        text: 'Operation failed: Unable to connect to server',
    },
};

// Expandable error with details
export const ExpandableError: Story = {
    args: {
        text: 'Command execution failed (click to expand)',
    },
    render: args => (
        <ChatMessageSystemError {...args}>
            <div>
                <p>Error code: E0042</p>
                <p className="mt-1">Details:</p>
                <pre className="bg-red-100 p-2 mt-1 rounded-sm overflow-auto">
                    {`Error: Command 'npm install' failed with exit code 1
Reason: Network error - Unable to connect to registry
Time: 2023-10-20T15:45:32Z
                    
Attempted to execute:
$ npm install --save react@latest
                    
To fix:
- Check your network connection
- Verify the package exists
- Try again with --verbose flag for more details`}
                </pre>
            </div>
        </ChatMessageSystemError>
    ),
};

// API error message
export const ApiError: Story = {
    args: {
        text: 'API request failed (click to expand)',
    },
    render: args => (
        <ChatMessageSystemError {...args}>
            <div>
                <p>Status: 401 Unauthorized</p>
                <p className="mt-1">Response:</p>
                <pre className="bg-red-100 p-2 mt-1 rounded-sm overflow-auto">
                    {`{
  "error": "invalid_token",
  "error_description": "The access token provided has expired",
  "timestamp": "2023-10-20T14:22:10Z"
}`}
                </pre>
            </div>
        </ChatMessageSystemError>
    ),
};
