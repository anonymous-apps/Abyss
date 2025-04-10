import { formatDistanceToNow } from 'date-fns';
import { Globe, NotepadText } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router';
import { MessageRecord } from '../../../server/preload/controllers/message';
import { GhostIconButton } from '../input/button';
import { ReferencedObject } from './record-references';

interface ChatMessageSectionProps {
    message: MessageRecord;
    joined: boolean;
}

export function ChatMessageSection({ message, joined }: ChatMessageSectionProps) {
    const navigate = useNavigate();

    const sender = message.sourceId.split('::')[0];
    const isUserSender = sender === 'USER';

    return (
        <div
            className={`hover:bg-background-transparent border border-transparent hover:shadow-sm transition-all duration-300 rounded-sm p-2 relative text-sm`}
        >
            {!joined && <SectionHeader message={message} />}
            <div className="flex items-center px-2">
                {isUserSender && <UserMessageSection message={message} />}
                {!isUserSender && <AiMessageSection message={message} />}
            </div>

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
    const formattedTime = formatDistanceToNow(new Date(message.createdAt), { addSuffix: true });

    return (
        <div className="flex items-center text-xs mb-3 gap-4 rounded-sm p-2 w-fit">
            <ReferencedObject sourceId={message.sourceId} />
            <span className="text-text-dark opacity-70 text-xms">{formattedTime}</span>
        </div>
    );
}

function UserMessageSection({ message }: { message: MessageRecord }) {
    if (message.content.text) {
        return (
            <pre className="rounded overflow-hidden my-2 mr-10" style={{ fontFamily: 'sans-serif' }}>
                {message.content.text}
            </pre>
        );
    }
    return <pre className="rounded overflow-hidden my-2 mr-10">{JSON.stringify(message.content, null, 2)}</pre>;
}

function AiMessageSection({ message }: { message: MessageRecord }) {
    return (
        <pre className="rounded overflow-hidden my-2 mr-10" style={{ fontFamily: 'sans-serif' }}>
            {message.content.text}
        </pre>
    );
}

// function ToolCallSection({ message }: { message: MessageRecord }) {
//     const toolInvocationId = message.references?.toolInvocationId || '';
//     const toolInvocation = useDatabaseTableSubscription('toolInvocation', async db => db.table.toolInvocation.findById(toolInvocationId), [
//         toolInvocationId,
//     ]);

//     return (
//         <div className="border border-primary-light rounded overflow-hidden my-2 mr-10">
//             <div className="bg-background-dark px-2 py-2 font-medium text-text-dark border-b border-primary-light border-b flex items-center gap-2">
//                 <Hammer size={16} />
//                 {toolInvocation.data?.toolId}
//             </div>
//             <div className="p-2 bg-background-base">{JSON.stringify(toolInvocation.data?.parameters, null, 2)}</div>
//         </div>
//     );
// }
