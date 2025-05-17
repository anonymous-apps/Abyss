import type { Meta, StoryObj } from '@storybook/react';
import { FileText, Info, Terminal } from 'lucide-react';
import ChatMessageSystemEvent from './ChatMessageSystemEvent';

// Meta information for the component
const meta: Meta<typeof ChatMessageSystemEvent> = {
    title: 'Chat Components/ChatMessageSystemEvent',
    component: ChatMessageSystemEvent,
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        text: {
            control: 'text',
        },
    },
};

export default meta;
type Story = StoryObj<typeof ChatMessageSystemEvent>;

// Basic event without expansion
export const BasicEvent: Story = {
    args: {
        icon: Info,
        text: 'System event notification without expandable content',
    },
};

// Expandable event with content
export const ExpandableEvent: Story = {
    args: {
        icon: Terminal,
        text: 'Command executed successfully (click to expand)',
    },
    render: args => (
        <ChatMessageSystemEvent {...args}>
            <div className="text-text-400">
                <p>Command: git status</p>
                <p className="mt-1">Output:</p>
                <pre className="bg-background-200 p-2 mt-1 rounded-sm overflow-auto">
                    On branch main Your branch is up to date with 'origin/main'. Changes not staged for commit: (use "git add
                    &lt;file&gt;..." to update what will be committed) modified: src/components/App.tsx
                </pre>
            </div>
        </ChatMessageSystemEvent>
    ),
};

// File event with content
export const FileEvent: Story = {
    args: {
        icon: FileText,
        text: 'File created: README.md (click to expand)',
    },
    render: args => (
        <ChatMessageSystemEvent {...args}>
            <div className="text-text-400">
                <p className="font-medium">File Content:</p>
                <pre className="bg-background-200 p-2 mt-1 rounded-sm overflow-auto">
                    # Project Title A brief description of what this project does. ## Installation ```bash npm install ``` ## Usage ```bash
                    npm start ```
                </pre>
            </div>
        </ChatMessageSystemEvent>
    ),
};
