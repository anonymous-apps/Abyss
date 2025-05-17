import type { Meta, StoryObj } from '@storybook/react';
import Center from './Center';

// Meta information for the component
const meta: Meta<typeof Center> = {
    title: 'Layout/Center',
    component: Center,
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof Center>;

// Basic example
export const Default: Story = {
    args: {
        children: <div className="p-4 bg-primary-100 rounded">Centered Content</div>,
    },
};
