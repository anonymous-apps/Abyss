import { ChatMessageText, ChatTurnHeader } from '@abyss/ui-components';
import { formatDistanceToNow } from 'date-fns';
import { Check, Loader2, PlayIcon, TerminalIcon, X } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';
import { MessageRecord, MessageText, MessageToolCall } from '../../../server/preload/controllers/message';
import { Database } from '../../main';
import { useDatabaseRecordSubscription, useDatabaseTableSubscription } from '../../state/database-connection';
import { useActionItems, useRecordReference } from '../references';
import { MonospaceText } from './monospace-text';
interface ChatMessageSectionProps {
    message: MessageRecord;
    showHeader: boolean;
}

export function ChatMessageSection({ message, showHeader }: ChatMessageSectionProps) {
    const navigate = useNavigate();

    const sender = message.sourceId.split('::')[0];
    const isUserTextSender = sender === 'USER' && 'text' in message.content;
    const isAiTextSender = sender !== 'USER' && 'text' in message.content;
    const isAiToolSender = sender !== 'USER' && 'tool' in message.content;

    return (
        <div>
            {showHeader && <SectionHeader message={message} />}
            {isUserTextSender && <UserMessageSection message={message as MessageRecord<MessageText>} />}
            {isAiTextSender && <AiMessageTextSection message={message as MessageRecord<MessageText>} />}
            {isAiToolSender && <AiToolMessageSection message={message as MessageRecord<MessageToolCall>} />}
        </div>
    );
}

function SectionHeader({ message }: { message: MessageRecord }) {
    const navigate = useNavigate();
    const reference = useRecordReference({ sourceId: message.sourceId });
    const formattedTime = formatDistanceToNow(new Date(message.createdAt), { addSuffix: true });

    return (
        <ChatTurnHeader
            icon={reference.icon}
            label={reference.label}
            timestamp={formattedTime}
            onClick={reference.link ? () => navigate(reference.link!) : undefined}
        />
    );
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
    const [viewMode, setViewMode] = useState<'input' | 'output' | null>('input');
    const invokable = message.content.tool.status === 'idle' || !message.content.tool.status;
    const onInvokeTool = () => {
        Database.workflows.InvokeToolFromMessage(message.id);
    };
    const invocation = useDatabaseRecordSubscription('toolInvocation', message.content.tool.invocationId || '', db =>
        db.table.toolInvocation.getByRecordId(message.content.tool.invocationId || '')
    );
    const invocationData = invocation?.data;
    const textLogId = invocationData?.textLogId || '';
    const isIdle = invocationData?.status === 'idle' || !invocationData?.status;
    const isRunning = invocationData?.status === 'running';
    const isError = invocationData?.status === 'error';
    const isComplete = invocationData?.status === 'success';
    const textOutput = useDatabaseTableSubscription('textLog', db => db.table.textLog.getByRecordId(textLogId), [textLogId]);
    const textOutputData = textOutput?.data;

    return (
        <div className="rounded overflow-hidden my-2 mr-10 w-full">
            <div className="flex items-center justify-between border rounded-lg p-2 bg-background-300 z-10 relative">
                <div className="flex items-center gap-2 capitalize">
                    {isRunning && <Loader2 size={18} className="animate-spin border border-primary-300" />}
                    {isError && <X size={18} className="text-red-500 bg-red-100 rounded-full p-0.5 border border-red-500" />}
                    {isIdle && <TerminalIcon className="w-4 h-4" />}
                    {isComplete && <Check size={18} className="text-green-700 bg-green-200 rounded-full p-0.5 border border-green-700" />}
                    <span>{message.content.tool.name.split('-').join(' ')}</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        className={`px-2 py-1 text-xs rounded font-bold opacity-80 hover:opacity-100  ${
                            viewMode === 'input' ? 'bg-primary-300 text-text-100' : 'bg-transparent hover:text-primary-300'
                        }`}
                        onClick={() => setViewMode(viewMode === 'input' ? null : 'input')}
                    >
                        Input
                    </button>
                    <button
                        className={`px-2 py-1 text-xs rounded font-bold opacity-80 hover:opacity-100  ${
                            viewMode === 'output' ? 'bg-primary-300 text-text-100' : 'bg-transparent hover:text-primary-300'
                        }`}
                        onClick={() => setViewMode(viewMode === 'output' ? null : 'output')}
                    >
                        Output
                    </button>
                </div>
            </div>
            {viewMode === 'input' && (
                <pre className="rounded overflow-hidden w-full whitespace-pre-wrap p-2 border rounded-lg border-t-0 rounded-t-none -translate-y-3 pt-4">
                    <JsonView src={message.content.tool.parameters} />
                </pre>
            )}
            {viewMode === 'output' && (
                <pre className="rounded overflow-hidden w-full whitespace-pre-wrap p-2 border rounded-lg border-t-0 rounded-t-none -translate-y-3 pt-4 max-h-[400px] overflow-y-auto">
                    {textOutputData?.text && <MonospaceText text={textOutputData?.text} />}
                    {!textOutputData?.text && 'No output yet'}
                </pre>
            )}
            {invokable && (
                <div className="flex items-center justify-end">
                    <button
                        className="px-2 py-1 text-xs rounded font-bold border border-primary-300  hover:bg-primary-300 hover:text-text-100 flex items-center gap-2"
                        onClick={onInvokeTool}
                    >
                        <PlayIcon className="w-4 h-4" />
                        Invoke Tool
                    </button>
                </div>
            )}
        </div>
    );
}
