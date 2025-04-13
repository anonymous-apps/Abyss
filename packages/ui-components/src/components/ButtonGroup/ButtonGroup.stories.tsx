import type { Meta, StoryObj } from '@storybook/react';
import { Home, Settings, User } from 'lucide-react';
import { Button } from '../Button';
import { ButtonGroup } from './ButtonGroup';

const meta: Meta<typeof ButtonGroup> = {
    title: 'Components/ButtonGroup',
    component: ButtonGroup,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
    args: {
        buttons: [
            <Button key="1" variant="primary">
                Button 1
            </Button>,
            <Button key="2" variant="primary">
                Button 2
            </Button>,
            <Button key="3" variant="primary">
                Button 3
            </Button>,
        ],
    },
};

export const MixedVariants: Story = {
    args: {
        buttons: [
            <Button key="1" variant="primary">
                Primary
            </Button>,
            <Button key="2" variant="secondary">
                Secondary
            </Button>,
            <Button key="3" variant="primary">
                Primary
            </Button>,
        ],
    },
};

export const PrimaryWithIcons: Story = {
    args: {
        variant: 'primary-with-icons',
        buttons: [
            <Button key="1" icon={Home}>
                Home
            </Button>,
            <Button key="2" icon={User}>
                User
            </Button>,
            <Button key="3" icon={Settings}>
                Settings
            </Button>,
        ],
    },
};
