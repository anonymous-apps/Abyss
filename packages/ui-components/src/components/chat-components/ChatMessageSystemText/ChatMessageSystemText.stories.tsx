import type { Meta, StoryObj } from '@storybook/react';
import ChatMessageSystemText from './ChatMessageSystemText';

// Meta information for the component
const meta: Meta<typeof ChatMessageSystemText> = {
    title: 'Chat Components/ChatMessageSystemText',
    component: ChatMessageSystemText,
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
type Story = StoryObj<typeof ChatMessageSystemText>;

// Basic system message
export const BasicSystemMessage: Story = {
    args: {
        text: 'This is a system message providing information to the user.',
    },
};

// Long system message
export const LongSystemMessage: Story = {
    args: {
        text: 'This is a longer system message that contains more information. System messages are typically used to convey status updates, instructions, or other meta information about the conversation or application state.',
    },
};
