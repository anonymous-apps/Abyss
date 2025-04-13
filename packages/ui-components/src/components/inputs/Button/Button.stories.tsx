import { Meta, StoryObj } from '@storybook/react';
import { Plus, Search } from 'lucide-react';
import Button from './Button';

// Meta information for the component
const meta: Meta<typeof Button> = {
    title: 'Inputs/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },

    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary'],
        },
        isLoading: {
            control: 'boolean',
        },
        isDisabled: {
            control: 'boolean',
        },
        isInactive: {
            control: 'boolean',
        },
        tooltip: {
            control: 'text',
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

// Inactive state example
export const Inactive: Story = {
    args: {
        variant: 'primary',
        children: 'Inactive',
        isInactive: true,
    },
};

// Button with icon and text
export const WithIcon: Story = {
    args: {
        variant: 'primary',
        children: 'Search',
        icon: Search,
    },
};

// Button with icon only
export const IconOnly: Story = {
    args: {
        variant: 'primary',
        icon: Plus,
    },
};

// Button with tooltip
export const WithTooltip: Story = {
    args: {
        variant: 'primary',
        children: 'Hover Me',
        tooltip: 'This is a tooltip',
    },
};

// Icon button with tooltip
export const IconWithTooltip: Story = {
    args: {
        variant: 'primary',
        icon: Plus,
        tooltip: 'Add New Item',
    },
};
