import { formatDistanceToNow } from 'date-fns';
import { BinaryIcon, Globe, NotepadText, TerminalIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';
import { MessageRecord, MessageText, MessageToolCall } from '../../../server/preload/controllers/message';
import { GhostIconButton } from '../input/button';
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

    console.log(message, isAiTextSender);

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
            </div>
        </div>
    );
}

function SectionHeader({ message }: { message: MessageRecord }) {
    const formattedTime = formatDistanceToNow(new Date(message.createdAt), { addSuffix: true });

    return (
        <div className="flex items-center text-xs mb-1 gap-4 rounded-sm p-1 w-fit">
            <div className="bg-primary-base text-text-light rounded-sm px-1 pr-2 py-1 -translate-x-1">
                <ReferencedObject sourceId={message.sourceId} />
            </div>
            <span className="text-text-dark opacity-70 text-xms">{formattedTime}</span>
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

    return (
        <div className="rounded overflow-hidden my-2 mr-10 w-full">
            <div className="flex items-center justify-between border rounded-lg p-2">
                <div className="flex items-center gap-2 capitalize">
                    <TerminalIcon className="w-4 h-4" />
                    <span>{message.content.tool.name.split('-').join(' ')}</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        className={`px-2 py-1 text-xs rounded font-bold opacity-50 hover:opacity-100  ${
                            viewMode === 'input' ? 'bg-primary-base text-text-light' : 'bg-transparent hover:text-primary-base'
                        }`}
                        onClick={() => setViewMode(viewMode === 'input' ? null : 'input')}
                    >
                        Input
                    </button>
                    <button
                        className={`px-2 py-1 text-xs rounded font-bold opacity-50 hover:opacity-100  ${
                            viewMode === 'output' ? 'bg-primary-base text-text-light' : 'bg-transparent hover:text-primary-base'
                        }`}
                        onClick={() => setViewMode(viewMode === 'output' ? null : 'output')}
                    >
                        Output
                    </button>
                </div>
            </div>
            {viewMode === 'input' && (
                <pre className="rounded overflow-hidden mr-10 w-full whitespace-pre-wrap p-2 border rounded-lg border-t-0 rounded-t-none -translate-y-3 pt-4">
                    <JsonView src={message.content.tool.parameters} />
                </pre>
            )}
            {viewMode === 'output' && (
                <pre className="rounded overflow-hidden mr-10 w-full whitespace-pre-wrap p-2 border rounded-lg border-t-0 rounded-b-none -translate-y-3 pt-4">
                    <code>{JSON.stringify(message.content, null, 2)}</code>
                </pre>
            )}
        </div>
    );
}
