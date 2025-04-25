import {
    ChatMessagePartial,
    TextMessagePartial,
    ToolDefinitionAddedMessagePartial,
    ToolDefinitionRemovedMessagePartial,
    ToolRequestMessagePartial,
} from '@abyss/intelligence';
import { ChatMessageSystemEvent, ChatMessageSystemText, ChatMessageText, ChatToolCall } from '@abyss/ui-components';
import { MinusIcon, PlusIcon } from 'lucide-react';
import React from 'react';
import { MessageRecord } from '../../../../server/preload/controllers/message';
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
                elements.push(<UserMessageSection key={message.id} message={message as MessageRecord<TextMessagePartial>} />);
            } else {
                console.error('Unknown user message type', message);
            }
        } else if (message.sourceId === 'SYSTEM') {
            if ('text' in message.content) {
                elements.push(<SystemTextMessageSection key={message.id} message={message as MessageRecord<TextMessagePartial>} />);
            } else if ('toolDefinitionAdded' in message.content) {
                elements.push(
                    <SystemToolDefinitionAddedMessageSection
                        key={message.id}
                        message={message as MessageRecord<ToolDefinitionAddedMessagePartial>}
                    />
                );
            } else if ('toolDefinitionRemoved' in message.content) {
                elements.push(
                    <SystemToolDefinitionRemovedMessageSection
                        key={message.id}
                        message={message as MessageRecord<ToolDefinitionRemovedMessagePartial>}
                    />
                );
            } else {
                console.error('Unknown system message type', message);
            }
        } else {
            if ('text' in message.content) {
                elements.push(<AiMessageTextSection key={message.id} message={message as MessageRecord<TextMessagePartial>} />);
            } else if ('toolRequest' in message.content) {
                elements.push(<AiToolMessageSection key={message.id} message={message as MessageRecord<ToolRequestMessagePartial>} />);
            } else {
                console.error('Unknown ai message type', message);
            }
        }
    }

    return <div className="flex flex-col gap-2">{elements}</div>;
}

function SystemTextMessageSection({ message }: { message: MessageRecord<ChatMessagePartial> }) {
    if ('text' in message.content) {
        return <ChatMessageSystemText text={message.content.text.content} />;
    } else {
        console.error('Unknown system text message type', message);
    }
}

function SystemToolDefinitionAddedMessageSection({ message }: { message: MessageRecord<ToolDefinitionAddedMessagePartial> }) {
    return (
        <ChatMessageSystemEvent
            icon={PlusIcon}
            text={'New tools registered: ' + message.content.toolDefinitionAdded.toolDefinitions.map(tool => tool.name).join(', ')}
        />
    );
}

function SystemToolDefinitionRemovedMessageSection({ message }: { message: MessageRecord<ToolDefinitionRemovedMessagePartial> }) {
    return (
        <ChatMessageSystemEvent
            icon={MinusIcon}
            text={'Tools removed: ' + message.content.toolDefinitionRemoved.toolDefinitions.map(tool => tool.name).join(', ')}
        />
    );
}

function UserMessageSection({ message }: { message: MessageRecord<TextMessagePartial> }) {
    const actionItems = useActionItems(message);
    return <ChatMessageText text={message.content.text.content} actionItems={actionItems} />;
}

function AiMessageTextSection({ message }: { message: MessageRecord<TextMessagePartial> }) {
    const actionItems = useActionItems(message);
    return <ChatMessageText text={message.content.text.content} actionItems={actionItems} />;
}

function AiToolMessageSection({ message }: { message: MessageRecord<ToolRequestMessagePartial> }) {
    const invocation = useTableRecordToolInvocation(message.content.toolRequest.callId);
    const textOutput = useTableRecordTextLog(invocation?.data?.textLogId);
    const textOutputData = textOutput?.data;

    return (
        <ChatToolCall
            toolName={message.content.toolRequest.name}
            status={invocation?.data?.status || 'idle'}
            inputData={message.content.toolRequest.args}
            outputText={textOutputData?.text}
            onInvoke={() => {
                Database.workflows.InvokeToolFromMessage(message.id);
            }}
        />
    );
}
