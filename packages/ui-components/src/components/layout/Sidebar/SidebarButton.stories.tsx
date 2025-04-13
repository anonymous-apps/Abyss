import type { Meta, StoryObj } from '@storybook/react';
import { FileText, Home } from 'lucide-react';
import { SidebarButton } from './SidebarButton';

const meta: Meta<typeof SidebarButton> = {
    title: 'Components/SidebarButton',
    component: SidebarButton,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    argTypes: {
        isActive: {
            control: 'boolean',
        },
        isClosable: {
            control: 'boolean',
        },
        isInProgress: {
            control: 'boolean',
        },
        onClick: { action: 'clicked' },
        onClose: { action: 'closed' },
    },
};

export default meta;
type Story = StoryObj<typeof SidebarButton>;

export const Default: Story = {
    args: {
        label: 'Home',
        icon: Home,
    },
};

export const Active: Story = {
    args: {
        label: 'Home',
        icon: Home,
        isActive: true,
    },
};

export const Closable: Story = {
    args: {
        label: 'Document.txt',
        icon: FileText,
        isClosable: true,
    },
};

export const InProgress: Story = {
    args: {
        label: 'Uploading',
        icon: FileText,
        isInProgress: true,
    },
};

export const AllFeatures: Story = {
    args: {
        label: 'Processing File',
        icon: FileText,
        isActive: true,
        isClosable: true,
        isInProgress: true,
    },
};
