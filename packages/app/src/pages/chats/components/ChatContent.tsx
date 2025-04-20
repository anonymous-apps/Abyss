import { ChatMessageText, ChatToolCall } from '@abyss/ui-components';
import React from 'react';
import { MessageRecord, MessageText, MessageToolCall } from '../../../../server/preload/controllers/message';
import { useActionItems } from '../../../library/references';
import { Database } from '../../../main';
import { useTableRecordTextLog, useTableRecordToolInvocation } from '../../../state/database-connection';
import { SectionHeader } from './ChatSectionHeader';

export function ChatHistoryRenderer({ messages }: { messages?: MessageRecord[] }) {
    let lastRole = '';
    const elements: React.ReactNode[] = [];

    for (const message of messages || []) {
        if (message.sourceId !== lastRole) {
            elements.push(<SectionHeader key={'header-' + message.id} message={message} />);
            lastRole = message.sourceId;
        }

        if (message.sourceId === 'USER') {
            if ('text' in message.content) {
                elements.push(<UserMessageSection key={message.id} message={message as MessageRecord<MessageText>} />);
            } else {
                console.error('Unknown message type', message);
            }
        } else if (message.sourceId === 'SYSTEM') {
            if ('text' in message.content) {
                elements.push(<SystemMessageSection key={message.id} message={message as MessageRecord<MessageText>} />);
            } else {
                console.error('Unknown message type', message);
            }
        } else {
            if ('text' in message.content) {
                elements.push(<AiMessageTextSection key={message.id} message={message as MessageRecord<MessageText>} />);
            } else if ('tool' in message.content) {
                elements.push(<AiToolMessageSection key={message.id} message={message as MessageRecord<MessageToolCall>} />);
            } else {
                console.error('Unknown message type', message);
            }
        }
    }

    return <div className="flex flex-col gap-2">{elements}</div>;
}

function SystemMessageSection({ message }: { message: MessageRecord<MessageText> }) {
    return <ChatMessageText text={message.content.text} />;
}

function UserMessageSection({ message }: { message: MessageRecord<MessageText> }) {
    const actionItems = useActionItems(message);
    return <ChatMessageText text={message.content.text} actionItems={actionItems} />;
}

function AiMessageTextSection({ message }: { message: MessageRecord<MessageText> }) {
    const actionItems = useActionItems(message);
    return <ChatMessageText text={message.content.text} actionItems={actionItems} />;
}

function AiToolMessageSection({ message }: { message: MessageRecord<MessageToolCall> }) {
    const invocation = useTableRecordToolInvocation(message.content.tool.invocationId);
    const textOutput = useTableRecordTextLog(invocation?.data?.textLogId);
    const textOutputData = textOutput?.data;

    return (
        <ChatToolCall
            toolName={message.content.tool.name}
            status={invocation?.data?.status || 'idle'}
            inputData={message.content.tool.parameters}
            outputText={textOutputData?.text}
            onInvoke={() => {
                Database.workflows.InvokeToolFromMessage(message.id);
            }}
        />
    );
}
