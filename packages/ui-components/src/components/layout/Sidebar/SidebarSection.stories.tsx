import type { Meta, StoryObj } from '@storybook/react';
import { SidebarSection } from './SidebarSection';

const meta: Meta<typeof SidebarSection> = {
    title: 'Layout/SidebarSection',
    component: SidebarSection,
    parameters: {
        layout: 'padded',
    },

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
    },
};
