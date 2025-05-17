import type { Meta, StoryObj } from '@storybook/react';
import { Bell, Settings, User } from 'lucide-react';
import { Tile } from './Tile';

// Meta information for the component
const meta: Meta<typeof Tile> = {
    title: 'Content/Tile',
    component: Tile,
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        title: {
            control: 'text',
        },
        href: {
            control: 'text',
        },
        onClick: { action: 'clicked' },
    },
};

export default meta;
type Story = StoryObj<typeof Tile>;

// Basic Tile
export const Basic: Story = {
    args: {
        title: 'Dashboard',
        href: '/dashboard',
        children: <p>View your project dashboard and analytics</p>,
    },
};

// Tile with Icon
export const WithIcon: Story = {
    args: {
        title: 'Settings',
        href: '/settings',
        icon: <Settings className="h-4 w-4" />,
        children: <p>Manage your account settings and preferences</p>,
    },
};

// Tile with Footer
export const WithFooter: Story = {
    args: {
        title: 'Notifications',
        href: '/notifications',
        icon: <Bell className="h-4 w-4" />,
        children: <p>View and manage your notification preferences</p>,
        footer: <span>12 new alerts</span>,
    },
};

// Complete Tile example
export const Complete: Story = {
    args: {
        title: 'User Profile',
        href: '/profile',
        icon: <User className="h-4 w-4" />,
        children: (
            <div>
                <p>Edit your profile information and preferences</p>
                <p>Update privacy settings</p>
            </div>
        ),
        footer: <span>Last updated 2 days ago</span>,
    },
};
