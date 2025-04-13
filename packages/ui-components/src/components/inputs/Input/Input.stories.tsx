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
        options: {
            control: 'object',
        },
        onChange: {
            action: 'changed',
            description: 'Returns string value directly instead of event',
        },
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
        label: 'Username',
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

// Input with options
export const WithOptions: Story = {
    args: {
        placeholder: 'Select a fruit or type your own',
        label: 'Fruit',
        options: [
            { label: 'Apple', content: 'Apple' },
            { label: 'Banana', content: 'Banana' },
            { label: 'Orange', content: 'Orange' },
            { label: 'Strawberry', content: 'Strawberry' },
            { label: 'Pineapple', content: 'Pineapple' },
        ],
    },
};

// Input with options and icon
export const WithOptionsAndIcon: Story = {
    args: {
        placeholder: 'Search a location',
        label: 'Location',
        icon: Search,
        options: [
            { label: 'New York', content: 'New York, NY' },
            { label: 'Los Angeles', content: 'Los Angeles, CA' },
            { label: 'Chicago', content: 'Chicago, IL' },
            { label: 'San Francisco', content: 'San Francisco, CA' },
        ],
    },
};

// Disabled input with options
export const DisabledWithOptions: Story = {
    args: {
        placeholder: 'Select a category',
        label: 'Category',
        isDisabled: true,
        options: [
            { label: 'Technology', content: 'Technology' },
            { label: 'Science', content: 'Science' },
            { label: 'Art', content: 'Art' },
            { label: 'Sports', content: 'Sports' },
        ],
    },
};
