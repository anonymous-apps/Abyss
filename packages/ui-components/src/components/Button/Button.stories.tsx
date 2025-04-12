import { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

// Meta information for the component
const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'outline', 'ghost'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        isLoading: {
            control: 'boolean',
        },
        isDisabled: {
            control: 'boolean',
        },
        onClick: { action: 'clicked' },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

// The primary story with simple button
export const Primary: Story = {
    args: {
        variant: 'primary',
        children: 'Button',
    },
};

// Secondary variant example
export const Secondary: Story = {
    args: {
        variant: 'secondary',
        children: 'Button',
    },
};

// Outline variant example
export const Outline: Story = {
    args: {
        variant: 'outline',
        children: 'Button',
    },
};

// Ghost variant example
export const Ghost: Story = {
    args: {
        variant: 'ghost',
        children: 'Button',
    },
};

// Loading state example
export const Loading: Story = {
    args: {
        variant: 'primary',
        children: 'Loading',
        isLoading: true,
    },
};

// Disabled state example
export const Disabled: Story = {
    args: {
        variant: 'primary',
        children: 'Disabled',
        isDisabled: true,
    },
};

// Small size example
export const Small: Story = {
    args: {
        variant: 'primary',
        children: 'Small',
        size: 'sm',
    },
};

// Large size example
export const Large: Story = {
    args: {
        variant: 'primary',
        children: 'Large',
        size: 'lg',
    },
};
