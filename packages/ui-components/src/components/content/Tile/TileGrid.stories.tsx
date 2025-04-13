import { Meta, StoryObj } from '@storybook/react';
import { Bell, File, Home, Settings, User } from 'lucide-react';
import Tile, { TileGrid } from '.';

// Meta information for the component
const meta: Meta<typeof TileGrid> = {
    title: 'Content/TileGrid',
    component: TileGrid,
    parameters: {
        layout: 'padded',
    },
};

export default meta;
type Story = StoryObj<typeof TileGrid>;

// Basic grid with two tiles
export const Basic: Story = {
    args: {
        children: (
            <>
                <Tile title="Dashboard" onClick={() => console.log('Dashboard clicked')} icon={<Home className="h-4 w-4" />}>
                    View your project dashboard and analytics
                </Tile>
                <Tile title="Settings" onClick={() => console.log('Settings clicked')} icon={<Settings className="h-4 w-4" />}>
                    Manage your account settings
                </Tile>
            </>
        ),
    },
};

// Grid with multiple tiles
export const MultiTile: Story = {
    args: {
        children: (
            <>
                <Tile title="Dashboard" onClick={() => console.log('Dashboard clicked')} icon={<Home className="h-4 w-4" />}>
                    View your project dashboard and analytics
                </Tile>
                <Tile title="Settings" onClick={() => console.log('Settings clicked')} icon={<Settings className="h-4 w-4" />}>
                    Manage your account settings
                </Tile>
                <Tile
                    title="Profile"
                    onClick={() => console.log('Profile clicked')}
                    icon={<User className="h-4 w-4" />}
                    footer="Last updated today"
                >
                    Edit your profile information
                </Tile>
                <Tile
                    title="Notifications"
                    onClick={() => console.log('Notifications clicked')}
                    icon={<Bell className="h-4 w-4" />}
                    footer="5 unread"
                >
                    View your notifications
                </Tile>
                <Tile title="Documents" onClick={() => console.log('Documents clicked')} icon={<File className="h-4 w-4" />}>
                    Access your documents and files
                </Tile>
            </>
        ),
    },
};

// Grid with custom class
export const CustomStyling: Story = {
    args: {
        className: 'justify-center bg-background-400 p-4 rounded-md',
        children: (
            <>
                <Tile title="Dashboard" onClick={() => console.log('Dashboard clicked')} icon={<Home className="h-4 w-4" />}>
                    View your project dashboard and analytics
                </Tile>
                <Tile title="Settings" onClick={() => console.log('Settings clicked')} icon={<Settings className="h-4 w-4" />}>
                    Manage your account settings
                </Tile>
            </>
        ),
    },
};
