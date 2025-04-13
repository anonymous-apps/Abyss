import { Button, InputArea, PageCrumbed } from '@abyss/ui-components';
import { BotIcon, Box } from 'lucide-react';
import React from 'react';
import { ChatMessageSection } from '../../library/content/chat-section';
import { getIconForSourceType } from '../../library/references';
import { useChatView } from './view.hook';

export function ChatViewPage() {
    const { chat, message, setMessage, handleKeyPress, onAskAiToRespond, onSendMessage, navigateToModel, isTyping, breadcrumbs } =
        useChatView();

    const headerReference = <Button variant="secondary" onClick={navigateToModel} icon={Box} tooltip="View model profile" />;
    const icon = React.createElement(getIconForSourceType(chat.chat?.references?.sourceId || ''));

    return (
        <PageCrumbed title={chat.chat?.name || 'Loading...'} icon={icon} actions={headerReference} breadcrumbs={breadcrumbs}>
            {chat.messages?.map((m, index) => (
                <ChatMessageSection
                    message={m}
                    key={m.id}
                    showHeader={index === 0 || chat.messages?.at(index - 1)?.sourceId !== m.sourceId}
                />
            ))}

            {isTyping ? (
                <div className="flex justify-center my-4">
                    <div className="animate-bounce text-text-700">
                        <BotIcon />
                    </div>
                </div>
            ) : (
                <>
                    <br />
                    <br />
                    <InputArea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        onKeyDown={handleKeyPress}
                    />
                    <div className="flex gap-2 justify-end">
                        <Button onClick={onAskAiToRespond}>Ask AI to respond again</Button>
                        <Button onClick={onSendMessage}>Send your message</Button>
                    </div>
                </>
            )}
        </PageCrumbed>
    );
}
