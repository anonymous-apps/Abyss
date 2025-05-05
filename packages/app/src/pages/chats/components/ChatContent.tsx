import { MessageThreadTurn, TextPartial } from '@abyss/records';
import { ChatMessageSystemText, ChatMessageText } from '@abyss/ui-components';
import React from 'react';
import { SectionHeader } from './ChatSectionHeader';

export function ChatHistoryRenderer({ thread }: { thread: MessageThreadTurn[] }) {
    const elements: React.ReactNode[] = [];

    for (let i = 0; i < thread.length; i++) {
        const turn = thread[i];
        // Set header for section
        elements.push(<SectionHeader key={'header-' + i} sender={turn.senderId} timestamp={new Date(turn.messages[0].createdAt)} />);

        // Render messages themselves
        for (let j = 0; j < turn.messages.length; j++) {
            const message = turn.messages[j];
            if (turn.senderId.toLowerCase() === 'user') {
                if (message.type === 'text') {
                    elements.push(<UserMessageSection key={'user-' + i + '-' + j} message={message} />);
                } else {
                    console.error('Unknown user message type', message);
                }
            } else if (turn.senderId.toLowerCase() === 'system') {
                if (message.type === 'text') {
                    elements.push(<SystemTextMessageSection key={'system-' + i + '-' + j} message={message} />);
                } else {
                    console.error('Unknown system message type', message);
                }
            } else if (turn.senderId.startsWith('agentGraph:')) {
                if (message.type === 'text') {
                    elements.push(<AiMessageTextSection key={'agent-' + i + '-' + j} message={message} />);
                } else {
                    console.error('Unknown agent graph message type', message);
                }
            } else if (turn.senderId.startsWith('modelConnection:')) {
                if (message.type === 'text') {
                    elements.push(<AiMessageTextSection key={'model-' + i + '-' + j} message={message} />);
                } else {
                    console.error('Unknown model connection message type', message);
                }
            } else {
                console.error('Unknown message type sender', turn.senderId, message);
            }
        }
    }

    return <div className="flex flex-col gap-2">{elements}</div>;
}

function SystemTextMessageSection({ message }: { message: TextPartial }) {
    return <ChatMessageSystemText text={message.payloadData.content} />;
}

function UserMessageSection({ message }: { message: TextPartial }) {
    return <ChatMessageText text={message.payloadData.content} />;
}

function AiMessageTextSection({ message }: { message: TextPartial }) {
    if (message.payloadData.content.length === 0) {
        return <ChatMessageText text={'empty string'} className="opacity-40" />;
    }
    return <ChatMessageText text={message.payloadData.content} />;
}
