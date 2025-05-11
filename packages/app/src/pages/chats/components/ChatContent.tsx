import { MessageThreadTurn, NewToolDefinitionPartial, RemoveToolDefinitionPartial, SystemErrorPartial, TextPartial } from '@abyss/records';
import { ChatMessageSystemError, ChatMessageSystemText, ChatMessageText } from '@abyss/ui-components';
import { Globe } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionHeader } from './ChatSectionHeader';

export function ChatHistoryRenderer({ thread }: { thread: MessageThreadTurn[] }) {
    const elements: React.ReactNode[] = [];
    const navigate = useNavigate();
    let lastTurn = '';
    let lastRenderedTurn = '';

    for (let i = 0; i < thread.length; i++) {
        const turn = thread[i];
        const elementsThisTurn: React.ReactNode[] = [];

        if (lastRenderedTurn === turn.senderId || turn.senderId === 'system') {
            // skip header
        } else {
            // Set header for section
            elementsThisTurn.push(
                <SectionHeader key={'header-' + i} sender={turn.senderId} timestamp={new Date(turn.messages[0].createdAt)} />
            );
            lastRenderedTurn = turn.senderId;
        }
        lastTurn = turn.senderId;

        // Render messages themselves
        for (let j = 0; j < turn.messages.length; j++) {
            const message = turn.messages[j];
            if (turn.senderId.toLowerCase() === 'user') {
                if (message.type === 'text') {
                    elementsThisTurn.push(<UserMessageSection key={'user-' + i + '-' + j} message={message} navigate={navigate} />);
                } else {
                    console.error('Unknown user message type', message);
                }
            } else if (turn.senderId.toLowerCase() === 'system') {
                if (message.type === 'text') {
                    elementsThisTurn.push(<SystemTextMessageSection key={'system-' + i + '-' + j} message={message} navigate={navigate} />);
                } else if (message.type === 'new-tool-definition') {
                    if (message.payloadData.tools.length !== 0) {
                        elementsThisTurn.push(
                            <NewToolDefinition key={'tool-definition-' + i + '-' + j} message={message} navigate={navigate} />
                        );
                    }
                } else if (message.type === 'remove-tool-definition') {
                    if (message.payloadData.tools.length !== 0) {
                        elementsThisTurn.push(
                            <RemovedToolDefinition key={'tool-definition-' + i + '-' + j} message={message} navigate={navigate} />
                        );
                    }
                } else if (message.type === 'system-error') {
                    elementsThisTurn.push(
                        <SystemErrorMessageSection key={'system-error-' + i + '-' + j} message={message} navigate={navigate} />
                    );
                } else {
                    console.error('Unknown system message type', message);
                }
            } else if (turn.senderId.startsWith('agentGraph:')) {
                if (message.type === 'text') {
                    elementsThisTurn.push(<AiMessageTextSection key={'agent-' + i + '-' + j} message={message} navigate={navigate} />);
                } else {
                    console.error('Unknown agent graph message type', message);
                }
            } else if (turn.senderId.startsWith('modelConnection:')) {
                if (message.type === 'text') {
                    elementsThisTurn.push(<AiMessageTextSection key={'model-' + i + '-' + j} message={message} navigate={navigate} />);
                } else {
                    console.error('Unknown model connection message type', message);
                }
            } else {
                console.error('Unknown message type sender', turn.senderId, message);
            }
        }

        elements.push(...elementsThisTurn);
    }

    return <div className="flex flex-col gap-2">{elements}</div>;
}
function getActionItems(message: Record<string, string> = {}, navigate: (path: string) => void) {
    const map = {
        logStreamId: (value: string) => ({
            icon: Globe,
            tooltip: 'LLM logs',
            onClick: () => {
                navigate(`/logs/id/${value}`);
            },
        }),
    };

    return Object.keys(message || {}).map(key => map[key]?.(message[key]));
}

function SystemTextMessageSection({ message, navigate }: { message: TextPartial; navigate: (path: string) => void }) {
    return <ChatMessageSystemText text={message.payloadData.content} actionItems={getActionItems(message.referencedData, navigate)} />;
}

function SystemErrorMessageSection({ message, navigate }: { message: SystemErrorPartial; navigate: (path: string) => void }) {
    return (
        <ChatMessageSystemError
            text={message.payloadData.error + ': ' + message.payloadData.message}
            actionItems={getActionItems(message.referencedData, navigate)}
            children={message.payloadData.body}
        />
    );
}
function NewToolDefinition({ message, navigate }: { message: NewToolDefinitionPartial; navigate: (path: string) => void }) {
    return (
        <ChatMessageSystemText
            text={'Added access to tools: ' + message.payloadData.tools.map(t => t.shortName).join(', ')}
            actionItems={getActionItems(message.referencedData, navigate)}
        />
    );
}

function RemovedToolDefinition({ message, navigate }: { message: RemoveToolDefinitionPartial; navigate: (path: string) => void }) {
    return (
        <ChatMessageSystemText
            text={'Removed access to tools: ' + message.payloadData.tools.map(t => t).join(', ')}
            actionItems={getActionItems(message.referencedData, navigate)}
        />
    );
}

function UserMessageSection({ message, navigate }: { message: TextPartial; navigate: (path: string) => void }) {
    return <ChatMessageText text={message.payloadData.content} actionItems={getActionItems(message.referencedData, navigate)} />;
}

function AiMessageTextSection({ message, navigate }: { message: TextPartial; navigate: (path: string) => void }) {
    if (message.payloadData.content.length === 0) {
        return (
            <ChatMessageText text={'empty string'} className="opacity-40" actionItems={getActionItems(message.referencedData, navigate)} />
        );
    }
    return <ChatMessageText text={message.payloadData.content} actionItems={getActionItems(message.referencedData, navigate)} />;
}
