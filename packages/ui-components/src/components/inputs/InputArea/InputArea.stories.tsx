import type { Meta, StoryObj } from '@storybook/react';
import InputArea from './InputArea';

// Meta information for the component
const meta: Meta<typeof InputArea> = {
    title: 'Inputs/InputArea',
    component: InputArea,
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
        rows: {
            control: { type: 'number', min: 2, max: 15, step: 1 },
        },
        onChange: { action: 'changed' },
    },
};

export default meta;
type Story = StoryObj<typeof InputArea>;

// The default story with a simple textarea
export const Default: Story = {
    args: {
        placeholder: 'Enter text here...',
        rows: 5,
    },
};

// Textarea with label
export const WithLabel: Story = {
    args: {
        placeholder: 'Enter a description...',
        rows: 5,
    },
};

// Textarea with helper text
export const WithHelperText: Story = {
    args: {
        placeholder: 'Enter your feedback...',
        rows: 5,
    },
};

// Textarea with error
export const WithError: Story = {
    args: {
        placeholder: 'Enter your comments...',
        rows: 5,
    },
};

// Small textarea
export const Small: Story = {
    args: {
        placeholder: 'Enter a short note...',
        rows: 2,
    },
};

// Large textarea
export const Large: Story = {
    args: {
        placeholder: 'Enter a detailed description...',
        rows: 10,
    },
};

// Disabled textarea
export const Disabled: Story = {
    args: {
        placeholder: 'This textarea is disabled',
        isDisabled: true,
        rows: 5,
    },
};
