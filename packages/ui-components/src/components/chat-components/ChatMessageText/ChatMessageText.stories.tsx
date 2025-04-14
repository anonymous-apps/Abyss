import { Meta, StoryObj } from '@storybook/react';
import { Copy, ThumbsDown, ThumbsUp } from 'lucide-react';
import ChatMessageText from './ChatMessageText';

// Meta information for the component
const meta: Meta<typeof ChatMessageText> = {
    title: 'Chat Components/ChatMessageText',
    component: ChatMessageText,
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        text: {
            control: 'text',
        },
        actionItems: {
            control: 'object',
        },
    },
};

export default meta;
type Story = StoryObj<typeof ChatMessageText>;

// Basic message
export const BasicMessage: Story = {
    args: {
        text: 'This is a simple chat message with no streaming or action items.',
    },
};

// Message with action items
export const MessageWithActions: Story = {
    args: {
        text: 'Here is a message with action items displayed on the right side.',
        actionItems: [
            {
                icon: Copy,
                tooltip: 'Copy to clipboard',
                onClick: () => console.log('Copy clicked'),
            },
            {
                icon: ThumbsUp,
                tooltip: 'Thumbs up',
                onClick: () => console.log('Thumbs up clicked'),
            },
            {
                icon: ThumbsDown,
                tooltip: 'Thumbs down',
                onClick: () => console.log('Thumbs down clicked'),
            },
        ],
    },
};

// Streaming message with action items
export const StreamingWithActions: Story = {
    args: {
        text: 'This message is still streaming but already has action items.',
        actionItems: [
            {
                icon: Copy,
                tooltip: 'Copy to clipboard',
                onClick: () => console.log('Copy clicked'),
            },
            {
                icon: ThumbsUp,
                tooltip: 'Thumbs up',
                onClick: () => console.log('Thumbs up clicked'),
            },
        ],
    },
};
