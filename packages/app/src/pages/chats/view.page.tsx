import { Button, InputArea, PageCrumbed } from '@abyss/ui-components';
import { Send } from 'lucide-react';
import React from 'react';
import { getIconForSourceType } from '../../library/references';
import { ChatHistoryRenderer } from './components/ChatContent';
import { useChatView } from './view.hook';

export function ChatViewPage() {
    const { chat, thread, message, setMessage, handleKeyPress, breadcrumbs, navigateToParticipant, handleSendMessage } = useChatView();
    const participantIcon = getIconForSourceType(chat?.participantId || '');
    const headerReference = (
        <Button variant="secondary" icon={participantIcon} tooltip="View model profile" onClick={navigateToParticipant} />
    );

    return (
        <PageCrumbed
            title={chat?.name || ''}
            icon={React.createElement(participantIcon)}
            actions={headerReference}
            breadcrumbs={breadcrumbs}
        >
            <ChatHistoryRenderer thread={thread || undefined} />
            <br />
            <br />
            {chat?.blocker && <div className="text-sm text-gray-500">Chat is responding...</div>}
            {!chat?.blocker && (
                <>
                    <InputArea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        onKeyDown={handleKeyPress}
                    />
                    <div className="flex justify-end">
                        <Button icon={Send} onClick={handleSendMessage}>
                            Send
                        </Button>
                    </div>
                </>
            )}
        </PageCrumbed>
    );
}
