import type { Meta, StoryObj } from '@storybook/react';
import MonospaceText from './MonospaceText';

// Meta information for the component
const meta: Meta<typeof MonospaceText> = {
    title: 'Content/MonospaceText',
    component: MonospaceText,
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        text: {
            control: 'text',
        },
        showLineNumbers: {
            control: 'boolean',
        },
    },
};

export default meta;
type Story = StoryObj<typeof MonospaceText>;

// Single line text
export const SingleLine: Story = {
    args: {
        text: 'This is a simple single line of monospaced text.',
        showLineNumbers: true,
    },
};

// Multi-line text
export const MultiLine: Story = {
    args: {
        text: `function example() {
  // This is a code example
  const message = "Hello, World!";
  console.log(message);
  return true;
}`,
        showLineNumbers: true,
    },
};

// Without line numbers
export const WithoutLineNumbers: Story = {
    args: {
        text: `function example() {
  // This is a code example
  const message = "Hello, World!";
  console.log(message);
  return true;
}`,
        showLineNumbers: false,
    },
};

// Long text with wrapping
export const LongWrappingText: Story = {
    args: {
        text: 'This is a very long line of text that should demonstrate how the component handles word wrapping for content that exceeds the width of its container. This is a very long line of text that should demonstrate how the component handles word wrapping for content that exceeds the width of its container.',
        showLineNumbers: true,
    },
};
