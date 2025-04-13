import { Meta, StoryObj } from '@storybook/react';
import { Bell, Home, Settings, User } from 'lucide-react';
import Button from '../../inputs/Button';
import { IconSection } from './IconSection';

// Meta information for the component
const meta: Meta<typeof IconSection> = {
    title: 'Layout/IconSection',
    component: IconSection,
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        title: {
            control: 'text',
        },
        subtitle: {
            control: 'text',
        },
        icon: {
            options: ['Settings', 'User', 'Home', 'Bell'],
            mapping: {
                Settings: Settings,
                User: User,
                Home: Home,
                Bell: Bell,
            },
            control: {
                type: 'select',
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof IconSection>;

// Basic section with icon and title
export const Basic: Story = {
    args: {
        icon: Settings,
        title: 'Settings',
        children: <p>This is a basic icon section with a settings icon.</p>,
    },
};

// Section with subtitle
export const WithSubtitle: Story = {
    args: {
        icon: User,
        title: 'User Profile',
        subtitle: 'Manage your personal information',
        children: <p>This section contains user profile settings.</p>,
    },
};

// Section with action button
export const WithAction: Story = {
    args: {
        icon: Home,
        title: 'Dashboard',
        action: <Button variant="secondary">View All</Button>,
        children: <p>This section has an action button to navigate somewhere.</p>,
    },
};

// Complex section with all features
export const Complex: Story = {
    args: {
        icon: Bell,
        title: 'Notifications',
        subtitle: 'Configure your notification settings',
        action: <Button variant="primary" icon={Settings} />,
        children: (
            <div className="space-y-2">
                <p>This is a complex icon section with multiple elements:</p>
                <ul className="list-disc pl-5">
                    <li>Icon and title</li>
                    <li>Subtitle for additional context</li>
                    <li>Action button</li>
                    <li>Rich content in the children area</li>
                </ul>
            </div>
        ),
    },
};
