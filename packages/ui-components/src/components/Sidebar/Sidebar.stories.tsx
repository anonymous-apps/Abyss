import type { Meta, StoryObj } from '@storybook/react';
import { Briefcase, FileText, Home, Settings, User } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { SidebarButton } from './SidebarButton';
import { SidebarSection } from './SidebarSection';

const meta: Meta<typeof Sidebar> = {
    title: 'Components/Sidebar',
    component: Sidebar,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    argTypes: {
        width: {
            control: { type: 'number' },
        },
        title: {
            control: 'text',
        },
    },
    decorators: [
        Story => (
            <div style={{ height: '500px' }}>
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
    args: {
        title: 'Sidebar',
        titleAction: <Settings className="h-4 w-4 text-text-500 cursor-pointer hover:text-primary-500" />,
        children: [
            <SidebarButton key="home" label="Home" icon={Home} isActive={true} />,
            <SidebarButton key="user" label="Profile" icon={User} />,
            <SidebarButton key="settings" label="Settings" icon={Settings} />,
        ],
    },
};

export const WithSections: Story = {
    args: {
        title: 'Project',
        children: [
            <SidebarSection key="main" title="Main">
                <SidebarButton label="Dashboard" icon={Home} isActive={true} />
                <SidebarButton label="Projects" icon={Briefcase} />
            </SidebarSection>,
            <SidebarSection key="settings" title="Settings">
                <SidebarButton label="Profile" icon={User} />
                <SidebarButton label="Preferences" icon={Settings} />
            </SidebarSection>,
        ],
    },
};

export const WithClosableButtons: Story = {
    args: {
        title: 'Recent Files',
        children: [
            <SidebarButton key="file1" label="Document 1.txt" icon={FileText} isClosable={true} />,
            <SidebarButton key="file2" label="Report.pdf" icon={FileText} isClosable={true} />,
            <SidebarButton key="file3" label="Presentation.pptx" icon={FileText} isClosable={true} isActive={true} />,
            <SidebarButton key="file4" label="Data.xlsx" icon={FileText} isClosable={true} />,
        ],
    },
};

export const LoadingState: Story = {
    args: {
        title: 'Processing',
        children: [
            <SidebarButton key="file1" label="Uploading" icon={FileText} isInProgress={true} />,
            <SidebarButton key="file2" label="Processing" icon={FileText} isInProgress={true} isActive={true} />,
            <SidebarButton key="file3" label="Completed" icon={FileText} />,
        ],
    },
};
