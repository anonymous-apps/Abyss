import { MessageThreadRecord, TextPartial } from '@abyss/records';
import { ChatMessageSystemText, ChatMessageText } from '@abyss/ui-components';
import React from 'react';
import { SectionHeader } from './ChatSectionHeader';

export function ChatHistoryRenderer({ thread }: { thread?: MessageThreadRecord }) {
    let lastRole = '';
    const elements: React.ReactNode[] = [];

    for (const turn of thread?.turns || []) {
        // Set header for section
        elements.push(<SectionHeader key={'header-' + turn.id} sender={turn.senderId} timestamp={turn.updatedAt} />);

        // Render messages themselves
        for (let i = 0; i < turn.partials.length; i++) {
            const message = turn.partials[i];
            if (turn.senderId.toLowerCase() === 'human') {
                if (message.type === 'text') {
                    elements.push(<UserMessageSection key={turn.id + '-' + i} message={message} />);
                } else {
                    console.error('Unknown user message type', message);
                }
            } else if (turn.senderId.toLowerCase() === 'system') {
                if (message.type === 'text') {
                    elements.push(<SystemTextMessageSection key={turn.id + '-' + i} message={message} />);
                } else {
                    console.error('Unknown system message type', message);
                }
            } else if (turn.senderId.startsWith('agentGraph:')) {
                if (message.type === 'text') {
                    elements.push(<AiMessageTextSection key={turn.id + '-' + i} message={message} />);
                } else {
                    console.error('Unknown agent graph message type', message);
                }
            } else if (turn.senderId.startsWith('modelConnection:')) {
                if (message.type === 'text') {
                    elements.push(<AiMessageTextSection key={turn.id + '-' + i} message={message} />);
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
    return <ChatMessageSystemText text={message.payload.content} />;
}

function UserMessageSection({ message }: { message: TextPartial }) {
    return <ChatMessageText text={message.payload.content} />;
}

function AiMessageTextSection({ message }: { message: TextPartial }) {
    return <ChatMessageText text={message.payload.content} />;
}
