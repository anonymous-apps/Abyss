import type { Meta, StoryObj } from '@storybook/react';
import { Bot, Clock, Copy, Eraser, FileIcon, type LucideIcon, Terminal, ThumbsUp, User } from 'lucide-react';

// Import components
import ChatMessageSystemError from './chat-components/ChatMessageSystemError/ChatMessageSystemError';
import ChatMessageSystemEvent from './chat-components/ChatMessageSystemEvent/ChatMessageSystemEvent';
import ChatMessageSystemText from './chat-components/ChatMessageSystemText/ChatMessageSystemText';
import { ChatMessageText } from './chat-components/ChatMessageText/ChatMessageText';
import { ChatToolCall } from './chat-components/ChatToolCall/ChatToolCall';
import { ChatTurnHeader } from './chat-components/ChatTurnHeader/ChatTurnHeader';
import { PageCrumbed } from './layout/PageCrumbed/PageCrumbed';
import { Sidebar } from './layout/Sidebar/Sidebar';
import { SidebarButton } from './layout/Sidebar/SidebarButton';
import { SidebarSection } from './layout/Sidebar/SidebarSection';

const meta: Meta = {
    title: 'Pages/Chat',
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj;

// Define message types for proper type checking
type TextMessage = {
    type: 'text';
    content: string;
    actionItems?: {
        icon: LucideIcon;
        tooltip: string;
        onClick: () => void;
    }[];
};

type SystemTextMessage = {
    type: 'system_text';
    content: string;
    actionItems?: {
        icon: LucideIcon;
        tooltip: string;
        onClick: () => void;
    }[];
};

type SystemEventMessage = {
    type: 'system_event';
    icon: LucideIcon; // 'info' | 'terminal' | 'file' etc.
    text: string;
    details?: string;
    actionItems?: {
        icon: LucideIcon;
        tooltip: string;
        onClick: () => void;
    }[];
};

type SystemErrorMessage = {
    type: 'system_error';
    text: string;
    details?: string;
    actionItems?: {
        icon: LucideIcon;
        tooltip: string;
        onClick: () => void;
    }[];
};

type ToolMessage = {
    type: 'tool';
    tool: string;
    input: any;
    status: 'notStarted' | 'inProgress' | 'success' | 'failed';
    output?: string;
    actionItems?: {
        icon: LucideIcon;
        tooltip: string;
        onClick: () => void;
    }[];
};

type ChatMessage = TextMessage | SystemTextMessage | SystemEventMessage | SystemErrorMessage | ToolMessage;

type ChatTurn = {
    role: 'user' | 'assistant' | 'system';
    timestamp: string;
    messages: ChatMessage[];
};

// Sample chat conversation
const sampleConversation: ChatTurn[] = [
    {
        role: 'system',
        timestamp: '2023-10-20T14:29:50Z',
        messages: [
            {
                type: 'system_text',
                content: 'Chat session started. Connected to Terminal Helper assistant.',
                actionItems: [
                    {
                        icon: Copy,
                        tooltip: 'Copy to clipboard',
                        onClick: () => console.log('Copy clicked'),
                    },
                ],
            },
        ],
    },
    {
        role: 'user',
        timestamp: '2023-10-20T14:30:00Z',
        messages: [
            {
                type: 'text',
                content: 'Could you help me list the files in my current directory and then create a simple README.md file?',
                actionItems: [
                    {
                        icon: Copy,
                        tooltip: 'Copy to clipboard',
                        onClick: () => console.log('Copy clicked'),
                    },
                ],
            },
        ],
    },
    {
        role: 'assistant',
        timestamp: '2023-10-20T14:30:05Z',
        messages: [
            {
                type: 'text',
                content: "I'll help you list the files in your current directory and create a README.md file.",
                actionItems: [
                    {
                        icon: Copy,
                        tooltip: 'Copy to clipboard',
                        onClick: () => console.log('Copy clicked'),
                    },
                    {
                        icon: ThumbsUp,
                        tooltip: 'Thumbs up',
                        onClick: () => console.log('Thumbs up clicked'),
                    },
                ],
            },
            {
                type: 'tool',
                tool: 'run_terminal_cmd',
                input: { command: 'ls -la' },
                status: 'success',
                output: 'total 16\ndrwxr-xr-x  4 user  staff   128 Oct 20 14:25 .\ndrwxr-xr-x  8 user  staff   256 Oct 20 14:20 ..\n-rw-r--r--  1 user  staff  2489 Oct 20 14:22 package.json\ndrwxr-xr-x 12 user  staff   384 Oct 20 14:25 node_modules\ndrwxr-xr-x  8 user  staff   256 Oct 20 14:22 src',
                actionItems: [
                    {
                        icon: Copy,
                        tooltip: 'Copy to clipboard',
                        onClick: () => console.log('Copy clicked'),
                    },
                    {
                        icon: FileIcon,
                        tooltip: 'Save output',
                        onClick: () => console.log('Save clicked'),
                    },
                ],
            },
            {
                type: 'system_event',
                icon: Terminal,
                text: 'Command executed successfully',
                details: 'Command: ls -la\nExecution time: 23ms\nExit code: 0',
                actionItems: [
                    {
                        icon: Copy,
                        tooltip: 'Copy to clipboard',
                        onClick: () => console.log('Copy clicked'),
                    },
                ],
            },
            {
                type: 'text',
                content:
                    "I can see your directory contains package.json, a node_modules folder, and a src folder. Now I'll create a README.md file for your project.",
                actionItems: [
                    {
                        icon: Copy,
                        tooltip: 'Copy to clipboard',
                        onClick: () => console.log('Copy clicked'),
                    },
                    {
                        icon: ThumbsUp,
                        tooltip: 'Thumbs up',
                        onClick: () => console.log('Thumbs up clicked'),
                    },
                ],
            },
            {
                type: 'tool',
                tool: 'edit_file',
                input: {
                    file: 'README.md',
                    content:
                        "# Project Title\n\nA brief description of what this project does and who it's for.\n\n## Installation\n\n```bash\nnpm install\n```\n\n## Usage\n\n```bash\nnpm start\n```\n\n## Features\n\n- Feature 1\n- Feature 2\n- Feature 3",
                },
                status: 'success',
                output: 'File README.md created successfully.',
                actionItems: [
                    {
                        icon: Copy,
                        tooltip: 'Copy to clipboard',
                        onClick: () => console.log('Copy clicked'),
                    },
                    {
                        icon: FileIcon,
                        tooltip: 'View file',
                        onClick: () => console.log('View clicked'),
                    },
                ],
            },
            {
                type: 'system_event',
                icon: FileIcon,
                text: 'File created: README.md',
                details:
                    "# Project Title\n\nA brief description of what this project does and who it's for.\n\n## Installation\n\n```bash\nnpm install\n```\n\n## Usage\n\n```bash\nnpm start\n```\n\n## Features\n\n- Feature 1\n- Feature 2\n- Feature 3",
                actionItems: [
                    {
                        icon: Copy,
                        tooltip: 'Copy to clipboard',
                        onClick: () => console.log('Copy clicked'),
                    },
                    {
                        icon: FileIcon,
                        tooltip: 'View file',
                        onClick: () => console.log('View clicked'),
                    },
                ],
            },
        ],
    },
    {
        role: 'user',
        timestamp: '2023-10-20T14:31:30Z',
        messages: [
            {
                type: 'text',
                content: 'Thanks! Now try installing a non-existent package.',
                actionItems: [
                    {
                        icon: Copy,
                        tooltip: 'Copy to clipboard',
                        onClick: () => console.log('Copy clicked'),
                    },
                ],
            },
        ],
    },
    {
        role: 'assistant',
        timestamp: '2023-10-20T14:31:35Z',
        messages: [
            {
                type: 'text',
                content: "I'll try to install a non-existent package to demonstrate an error condition.",
                actionItems: [
                    {
                        icon: Copy,
                        tooltip: 'Copy to clipboard',
                        onClick: () => console.log('Copy clicked'),
                    },
                ],
            },
            {
                type: 'tool',
                tool: 'run_terminal_cmd',
                input: { command: 'npm install non-existent-package-12345' },
                status: 'failed',
                output: "npm ERR! code E404\nnpm ERR! 404 Not Found - GET https://registry.npmjs.org/non-existent-package-12345 - Not found\nnpm ERR! 404 \nnpm ERR! 404  'non-existent-package-12345@latest' is not in this registry.\nnpm ERR! 404 \nnpm ERR! 404 Note that you can also install from a\nnpm ERR! 404 tarball, folder, http url, or git url.\n\nnpm ERR! A complete log of this run can be found in:\nnpm ERR!     /Users/.npm/_logs/2023-10-20T14_31_40_325Z-debug.log",
                actionItems: [
                    {
                        icon: Copy,
                        tooltip: 'Copy to clipboard',
                        onClick: () => console.log('Copy clicked'),
                    },
                ],
            },
            {
                type: 'system_error',
                text: 'Package installation failed',
                details: 'Error code: E404\nPackage: non-existent-package-12345\nThe specified package does not exist in the npm registry.',
                actionItems: [
                    {
                        icon: Copy,
                        tooltip: 'Copy to clipboard',
                        onClick: () => console.log('Copy clicked'),
                    },
                    {
                        icon: FileIcon,
                        tooltip: 'View error log',
                        onClick: () => console.log('View log clicked'),
                    },
                ],
            },
        ],
    },
    {
        role: 'system',
        timestamp: '2023-10-20T14:32:00Z',
        messages: [
            {
                type: 'system_text',
                content: 'Connection idle for 30 seconds. The assistant is waiting for your next input.',
                actionItems: [
                    {
                        icon: Copy,
                        tooltip: 'Copy to clipboard',
                        onClick: () => console.log('Copy clicked'),
                    },
                ],
            },
        ],
    },
];

export const Chat: Story = {
    render: () => {
        return (
            <div className="flex h-screen w-full overflow-hidden">
                {/* Sidebar */}
                <Sidebar title="Abyss" width={200}>
                    <SidebarSection key="main" title="Chats" />
                    <SidebarButton icon={Clock} label="Recent" isActive />
                    <SidebarButton icon={Terminal} label="Terminal Helper" />
                    <SidebarButton icon={Eraser} label="Code Cleaner" />
                    <SidebarSection key="admin" title="Settings" />
                    <SidebarButton icon={User} label="Profile" />
                </Sidebar>

                {/* Main Content */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    <PageCrumbed
                        title="Chat Session"
                        subtitle="Terminal Helper"
                        breadcrumbs={[
                            { name: 'Chats', onClick: () => console.log('Chats clicked') },
                            { name: 'Terminal Helper', onClick: () => console.log('Terminal Helper clicked') },
                        ]}
                        actions={
                            <div className="flex gap-2">
                                <button className="text-text-600 hover:text-text-900">
                                    <Copy size={16} />
                                </button>
                                <button className="text-text-600 hover:text-text-900">
                                    <ThumbsUp size={16} />
                                </button>
                            </div>
                        }
                    >
                        <div className="flex-1 overflow-y-auto">
                            <div className="space-y-6 pb-20">
                                {/* Render conversation */}
                                {sampleConversation.map((turn, turnIndex) => (
                                    <div key={turnIndex} className="rounded-lg p-4">
                                        {turn.role !== 'system' && (
                                            <ChatTurnHeader
                                                icon={turn.role === 'user' ? User : Bot}
                                                label={turn.role === 'user' ? 'User' : 'Assistant'}
                                                timestamp={turn.timestamp}
                                            />
                                        )}

                                        {turn.messages.map((message, msgIndex) => {
                                            if (message.type === 'text') {
                                                return (
                                                    <ChatMessageText
                                                        key={`${turnIndex}-${msgIndex}`}
                                                        text={message.content}
                                                        actionItems={message.actionItems}
                                                    />
                                                );
                                            } else if (message.type === 'tool') {
                                                return (
                                                    <ChatToolCall
                                                        key={`${turnIndex}-${msgIndex}`}
                                                        toolName={message.tool}
                                                        status={message.status}
                                                        inputData={message.input}
                                                        outputText={message.output || ''}
                                                        actionItems={message.actionItems}
                                                    />
                                                );
                                            } else if (message.type === 'system_text') {
                                                return (
                                                    <ChatMessageSystemText
                                                        key={`${turnIndex}-${msgIndex}`}
                                                        text={message.content}
                                                        actionItems={message.actionItems}
                                                    />
                                                );
                                            } else if (message.type === 'system_event') {
                                                return (
                                                    <ChatMessageSystemEvent
                                                        key={`${turnIndex}-${msgIndex}`}
                                                        icon={message.icon}
                                                        text={message.text}
                                                        actionItems={message.actionItems}
                                                    >
                                                        {message.details}
                                                    </ChatMessageSystemEvent>
                                                );
                                            } else if (message.type === 'system_error') {
                                                return (
                                                    <ChatMessageSystemError
                                                        key={`${turnIndex}-${msgIndex}`}
                                                        text={message.text}
                                                        actionItems={message.actionItems}
                                                    >
                                                        {message.details}
                                                    </ChatMessageSystemError>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </PageCrumbed>
                </div>
            </div>
        );
    },
};
