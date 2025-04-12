import { formatDistanceToNow } from 'date-fns';
import { BinaryIcon, Check, Globe, Hammer, Loader2, NotepadText, PlayIcon, TerminalIcon, X } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';
import { MessageRecord, MessageText, MessageToolCall } from '../../../server/preload/controllers/message';
import { Database } from '../../main';
import { useDatabaseRecordSubscription, useDatabaseTableSubscription } from '../../state/database-connection';
import { GhostIconButton } from '../input/button';
import { MonospaceText } from './monospace-text';
import { ReferencedObject } from './record-references';

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
        <div className="relative flex flex-row gap-2">
            <div
                className={`hover:bg-background-transparent border border-transparent  transition-all duration-300 rounded-sm p-1 text-sm flex-1`}
            >
                {showHeader && <SectionHeader message={message} />}
                <div className="flex items-center px-1">
                    {isUserTextSender && <UserMessageSection message={message as MessageRecord<MessageText>} />}
                    {isAiTextSender && <AiMessageTextSection message={message as MessageRecord<MessageText>} />}
                    {isAiToolSender && <AiToolMessageSection message={message as MessageRecord<MessageToolCall>} />}
                </div>
            </div>

            <div className="flex items-center justify-start flex-col ml-auto text-xs gap-1 h-fit rounded-lg mb-2">
                {message.references?.networkCallId && (
                    <GhostIconButton
                        icon={Globe}
                        onClick={() => navigate(`/database/id/networkCall/record/${message.references?.networkCallId}`)}
                        tooltip="View API call"
                        className="opacity-20 hover:opacity-100 z-10"
                    />
                )}
                {message.references?.renderedConversationThreadId && (
                    <GhostIconButton
                        icon={NotepadText}
                        onClick={() =>
                            navigate(`/database/id/renderedConversationThread/record/${message.references?.renderedConversationThreadId}`)
                        }
                        tooltip="View Conversation Snapshot"
                        className="opacity-20 hover:opacity-100 z-10"
                    />
                )}
                {message.references?.responseStreamId && (
                    <GhostIconButton
                        icon={BinaryIcon}
                        onClick={() => navigate(`/database/id/responseStream/record/${message.references?.responseStreamId}`)}
                        tooltip="View Response Stream"
                        className="opacity-20 hover:opacity-100 z-10"
                    />
                )}
                {message.references?.toolSourceId && (
                    <GhostIconButton
                        icon={Hammer}
                        onClick={() => navigate(`/database/id/tool/record/${message.references?.toolSourceId}`)}
                        tooltip="View Tool"
                        className="opacity-20 hover:opacity-100 z-10"
                    />
                )}
            </div>
        </div>
    );
}

function SectionHeader({ message }: { message: MessageRecord }) {
    const formattedTime = formatDistanceToNow(new Date(message.createdAt), { addSuffix: true });

    return (
        <div className="flex items-center text-xs mb-1 gap-4 rounded-sm p-1 w-fit">
            <div className="bg-primary-300 text-text-100 rounded-sm px-1 pr-2 py-1 -translate-x-1">
                <ReferencedObject sourceId={message.sourceId} />
            </div>
            <span className="text-text-700 opacity-70 text-xms">{formattedTime}</span>
        </div>
    );
}

function UserMessageSection({ message }: { message: MessageRecord<MessageText> }) {
    return (
        <pre className="rounded overflow-hidden my-2 mr-10" style={{ fontFamily: 'sans-serif' }}>
            {message.content.text}
        </pre>
    );
}

function AiMessageTextSection({ message }: { message: MessageRecord<MessageText> }) {
    return (
        <pre className="rounded overflow-hidden my-2 mr-10 w-full whitespace-pre-wrap" style={{ fontFamily: 'sans-serif' }}>
            {message.content.text}
        </pre>
    );
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
