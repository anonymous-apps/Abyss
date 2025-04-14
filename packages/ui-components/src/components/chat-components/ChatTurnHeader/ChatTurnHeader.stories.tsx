import { Meta, StoryObj } from '@storybook/react';
import { Bot, User } from 'lucide-react';
import ChatTurnHeader from './ChatTurnHeader';

// Meta information for the component
const meta: Meta<typeof ChatTurnHeader> = {
    title: 'Chat Components/ChatTurnHeader',
    component: ChatTurnHeader,
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        icon: {
            control: 'select',
            options: ['User', 'Bot'],
            mapping: {
                User: User,
                Bot: Bot,
            },
        },
        label: {
            control: 'text',
        },
        timestamp: {
            control: 'text',
        },
        onClick: { action: 'clicked' },
    },
};

export default meta;
type Story = StoryObj<typeof ChatTurnHeader>;

// User Message Header
export const UserHeader: Story = {
    args: {
        icon: User,
        label: 'You',
        timestamp: '2:45 PM',
    },
};

// Bot Message Header
export const BotHeader: Story = {
    args: {
        icon: Bot,
        label: 'AI Assistant',
        timestamp: '2:46 PM',
    },
};

// Clickable Header
export const ClickableHeader: Story = {
    args: {
        icon: Bot,
        label: 'AI Assistant',
        timestamp: '2:46 PM',
        onClick: () => console.log('Header clicked'),
    },
};
