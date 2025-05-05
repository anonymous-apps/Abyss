import { Meta, StoryObj } from '@storybook/react';
import { Status } from './Status';

const meta: Meta<typeof Status> = {
    title: 'Data/Status',
    component: Status,
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        status: {
            control: 'select',
            options: ['notStarted', 'inProgress', 'success', 'failed'],
        },
    },
};

export default meta;

type Story = StoryObj<typeof Status>;

export const NotStarted: Story = {
    args: {
        status: 'notStarted',
    },
};

export const InProgress: Story = {
    args: {
        status: 'inProgress',
    },
};

export const Success: Story = {
    args: {
        status: 'success',
    },
};

export const Failed: Story = {
    args: {
        status: 'failed',
    },
};
