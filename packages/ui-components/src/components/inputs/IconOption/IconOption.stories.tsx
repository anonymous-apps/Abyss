import { Meta, StoryObj } from '@storybook/react';
import { FileText, Settings, User } from 'lucide-react';
import IconOption from './IconOption';

// Meta information for the component
const meta: Meta<typeof IconOption> = {
    title: 'Components/IconOption',
    component: IconOption,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        isDisabled: {
            control: 'boolean',
        },
        onClick: { action: 'clicked' },
    },
};

export default meta;
type Story = StoryObj<typeof IconOption>;

// The basic story with document icon
export const Document: Story = {
    args: {
        title: 'Documents',
        icon: FileText,
        children: 'Access and manage your documents',
    },
};

// Settings icon example
export const SettingsOption: Story = {
    args: {
        title: 'Settings',
        icon: Settings,
        children: 'Configure your preferences',
    },
};

// User profile example
export const UserProfile: Story = {
    args: {
        title: 'User Profile',
        icon: User,
        children: 'View and edit your profile',
    },
};

// Disabled state example
export const Disabled: Story = {
    args: {
        title: 'Unavailable',
        icon: FileText,
        children: 'This feature is currently unavailable',
        isDisabled: true,
    },
};

// Example without click handler
export const NonClickable: Story = {
    args: {
        title: 'Information',
        icon: FileText,
        children: 'This option is just for display and is not clickable',
    },
};
