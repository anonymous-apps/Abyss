import type { Meta, StoryObj } from '@storybook/react';
import { SelectDropdown } from './SelectDropdown';

const meta: Meta<typeof SelectDropdown> = {
    title: 'Inputs/SelectDropdown',
    component: SelectDropdown,
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof SelectDropdown>;

const options = [
    { id: '1', label: 'Option 1' },
    { id: '2', label: 'Option 2' },
    { id: '3', label: 'Option 3' },
    { id: '4', label: 'Option 4' },
];

export const Default: Story = {
    args: {
        options,
        onSelect: id => console.log(`Selected: ${id}`),
    },
};

export const WithSelection: Story = {
    args: {
        options,
        selectedId: '2',
        onSelect: id => console.log(`Selected: ${id}`),
    },
};

export const CustomWidth: Story = {
    args: {
        options,
        onSelect: id => console.log(`Selected: ${id}`),
        className: 'w-72',
    },
};

export const NoOptions: Story = {
    args: {
        options: [],
        onSelect: id => console.log(`Selected: ${id}`),
    },
};
