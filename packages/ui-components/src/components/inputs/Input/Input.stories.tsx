import { Meta, StoryObj } from '@storybook/react';
import { Lock, Mail, Search } from 'lucide-react';
import Input from './Input';

// Meta information for the component
const meta: Meta<typeof Input> = {
    title: 'Inputs/Input',
    component: Input,
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        placeholder: {
            control: 'text',
        },
        isDisabled: {
            control: 'boolean',
        },
        type: {
            control: 'select',
            options: ['text', 'password', 'email', 'number'],
        },
        onChange: { action: 'changed' },
    },
};

export default meta;
type Story = StoryObj<typeof Input>;

// The default story with a simple input
export const Default: Story = {
    args: {
        placeholder: 'Enter text here...',
    },
};

// Input with label
export const WithLabel: Story = {
    args: {
        placeholder: 'Enter your username',
    },
};

// Input with helper text
export const WithHelperText: Story = {
    args: {
        placeholder: 'Enter your email',
    },
};

// Input with error
export const WithError: Story = {
    args: {
        type: 'password',
        placeholder: 'Enter your password',
    },
};

// Input with icon
export const WithIcon: Story = {
    args: {
        placeholder: 'Search...',
        icon: Search,
    },
};

// Disabled input
export const Disabled: Story = {
    args: {
        placeholder: 'This input is disabled',
        isDisabled: true,
    },
};

// Password input
export const Password: Story = {
    args: {
        type: 'password',
        placeholder: 'Enter your password',
        icon: Lock,
    },
};

// Email input
export const Email: Story = {
    args: {
        type: 'email',
        placeholder: 'Enter your email',
        icon: Mail,
    },
};
