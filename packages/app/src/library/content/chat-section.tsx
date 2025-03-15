import { formatDistanceToNow } from 'date-fns';
import { Globe, NotepadText } from 'lucide-react';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router';
import { MessageRecord } from '../../../server/preload/controllers/message';
import { useDatabaseRecordSubscription } from '../../state/database-connection';
import { getIconForSourceType } from '../icons';
import { GhostIconButton } from '../input/button';

export function ChatMessageSection({ message }: { message: MessageRecord }) {
    // Format the timestamp to a human-readable string (e.g., "5 minutes ago")
    const formattedTime = formatDistanceToNow(new Date(message.createdAt), { addSuffix: true });

    // Get the model name
    const model = useDatabaseRecordSubscription('modelConnections', message.sourceId, db =>
        db.table.modelConnections.findById(message.sourceId)
    );

    // Determine if the message is from the user or a model
    const isUserMessage = message.type === 'USER';
    const isAiMessage = message.type === 'AI';
    const navigate = useNavigate();

    const Icon = getIconForSourceType(isUserMessage ? 'user' : 'chat');

    return (
        <div className="mb-6 hover:bg-background-transparent border border-transparent hover:border-background-light transition-all duration-300 rounded-sm p-2">
            <div className="flex items-center text-xs mb-1 gap-2">
                <Icon size={14} className="" />
                {isUserMessage && <span className="font-medium text-text-dark mr-2">You</span>}
                {isAiMessage && (
                    <span
                        className="font-medium text-text-dark mr-2 cursor-pointer hover:underline capitalize"
                        onClick={() => navigate(`/database/id/modelConnections/record/${message.sourceId}`)}
                    >
                        {model.data?.name}
                    </span>
                )}
                <span className="text-text-dark opacity-70">{formattedTime}</span>
            </div>
            <div className="py-3 rounded text-text-light text-xs font-mono markdown">
                <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
            <div className="flex items-center justify-end text-xs my-1 gap-2">
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
