import { formatDistanceToNow } from 'date-fns';
import { Globe, Hammer, NotepadText } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router';
import { MessageRecord } from '../../../server/preload/controllers/message';
import { useDatabaseTableSubscription } from '../../state/database-connection';
import { getIconForSourceType } from '../icons';
import { GhostIconButton } from '../input/button';

interface ChatMessageSectionProps {
    message: MessageRecord;
    chatType: string;
    joined: boolean;
}

export function ChatMessageSection({ message, chatType, joined }: ChatMessageSectionProps) {
    const navigate = useNavigate();

    return (
        <div
            className={`hover:bg-background-transparent border border-transparent hover:shadow-sm transition-all duration-300 rounded-sm p-2 relative text-sm`}
        >
            {!joined && <SectionHeader message={message} />}
            {message.type === 'AI' && <AiMessageSection message={message} />}
            {message.type === 'TOOL' && <ToolCallSection message={message} />}
            {message.type === 'USER' && <UserMessageSection message={message} />}

            <div className="flex items-center justify-start flex-col ml-auto text-xs gap-2 h-fit rounded-lg absolute right-0 top-0">
                {message.references?.networkCallId && (
                    <GhostIconButton
                        icon={Globe}
                        onClick={() => navigate(`/database/id/networkCall/record/${message.references?.networkCallId}`)}
                        tooltip="View API call"
                    />
                )}
                {message.references?.renderedConversationThreadId && (
                    <GhostIconButton
                        icon={NotepadText}
                        onClick={() =>
                            navigate(`/database/id/renderedConversationThread/record/${message.references?.renderedConversationThreadId}`)
                        }
                        tooltip="View Conversation Snapshot"
                    />
                )}
            </div>
        </div>
    );
}

function SectionHeader({ message }: { message: MessageRecord }) {
    const Icon = getIconForSourceType(message.type);
    const formattedTime = formatDistanceToNow(new Date(message.createdAt), { addSuffix: true });

    // Get the thread
    const responseStream = useDatabaseTableSubscription('responseStream', db => db.table.responseStream.findById(message.sourceId));
    const modelId = responseStream.data?.sourceId || '';
    const model = useDatabaseTableSubscription('modelConnections', async db => db.table.modelConnections.findById(modelId), [modelId]);

    return (
        <div className="flex items-center text-xs mb-3 gap-2 bg-background-base rounded-sm p-2 w-fit">
            <Icon size={14} className="" />
            {message.type === 'USER' && <span className="text-text-dark opacity-70">You</span>}
            <span className="text-text-dark opacity-70">{model.data?.name}</span>
            <span className="text-text-dark opacity-70">{formattedTime}</span>
        </div>
    );
}

function UserMessageSection({ message }: { message: MessageRecord }) {
    return <pre className="rounded overflow-hidden my-2 mr-10">{message.content}</pre>;
}

function AiMessageSection({ message }: { message: MessageRecord }) {
    return <pre className="rounded overflow-hidden my-2 mr-10">{message.content}</pre>;
}

function ToolCallSection({ message }: { message: MessageRecord }) {
    const toolInvocationId = message.references?.toolInvocationId || '';
    const toolInvocation = useDatabaseTableSubscription('toolInvocation', async db => db.table.toolInvocation.findById(toolInvocationId), [
        toolInvocationId,
    ]);

    return (
        <div className="border border-primary-light rounded overflow-hidden my-2 mr-10">
            <div className="bg-background-dark px-2 py-2 font-medium text-text-dark border-b border-primary-light border-b flex items-center gap-2">
                <Hammer size={16} />
                {toolInvocation.data?.toolId}
            </div>
            <div className="p-2 bg-background-base">{JSON.stringify(toolInvocation.data?.parameters, null, 2)}</div>
        </div>
    );
}
