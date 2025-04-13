import type { Meta, StoryObj } from '@storybook/react';
import { FileText, Home, Settings, User } from 'lucide-react';
import { SidebarButton } from './SidebarButton';
import { SidebarSection } from './SidebarSection';

const meta: Meta<typeof SidebarSection> = {
    title: 'Components/SidebarSection',
    component: SidebarSection,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    argTypes: {
        title: {
            control: 'text',
        },
    },
};

export default meta;
type Story = StoryObj<typeof SidebarSection>;

export const Default: Story = {
    args: {
        title: 'Navigation',
        children: [
            <SidebarButton key="home" label="Home" icon={Home} isActive={true} />,
            <SidebarButton key="settings" label="Settings" icon={Settings} />,
            <SidebarButton key="profile" label="Profile" icon={User} />,
        ],
    },
};

export const Files: Story = {
    args: {
        title: 'Recent Files',
        children: [
            <SidebarButton key="file1" label="Document.txt" icon={FileText} />,
            <SidebarButton key="file2" label="Report.pdf" icon={FileText} />,
            <SidebarButton key="file3" label="Presentation.pptx" icon={FileText} isActive={true} />,
        ],
    },
};
