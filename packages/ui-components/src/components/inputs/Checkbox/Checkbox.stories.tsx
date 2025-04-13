import { Meta, StoryObj } from '@storybook/react';
import Checkbox from './Checkbox';

// Meta information for the component
const meta: Meta<typeof Checkbox> = {
    title: 'Inputs/Checkbox',
    component: Checkbox,
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        checked: {
            control: 'boolean',
        },
        isDisabled: {
            control: 'boolean',
        },
        label: {
            control: 'text',
        },
        description: {
            control: 'text',
        },
        tooltip: {
            control: 'text',
        },
        onChange: { action: 'changed' },
    },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

// The default story with a simple checkbox
export const Default: Story = {
    args: {
        checked: false,
        label: 'Check me',
    },
};

// Checked state example
export const Checked: Story = {
    args: {
        checked: true,
        label: 'Checked',
    },
};

// Disabled state example
export const Disabled: Story = {
    args: {
        checked: false,
        label: 'Disabled',
        isDisabled: true,
    },
};

// Checkbox with description
export const WithDescription: Story = {
    args: {
        checked: false,
        label: 'Terms and Conditions',
        description: 'I agree to the terms and conditions of the service',
    },
};

// Checkbox with tooltip
export const WithTooltip: Story = {
    args: {
        checked: false,
        label: 'Hover Me',
        tooltip: 'This is a tooltip for the checkbox',
    },
};

// Checkbox with both description and tooltip
export const WithDescriptionAndTooltip: Story = {
    args: {
        checked: false,
        label: 'Enable Feature',
        description: 'Enabling this feature will activate advanced functionality',
        tooltip: 'Advanced features include analytics and reporting',
    },
};
