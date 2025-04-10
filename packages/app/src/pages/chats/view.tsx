import { BotIcon, Box } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChatMessageSection } from '../../library/content/chat-section';
import { getIconForSourceType } from '../../library/content/record-references';
import { Button, GhostIconButton } from '../../library/input/button';
import { InputArea } from '../../library/input/input';
import { PageHeader } from '../../library/layout/page-header';
import { Database } from '../../main';
import { useChatWithModel } from '../../state/hooks/useChat';
export function ChatViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const chat = useChatWithModel(id || '');
    const [message, setMessage] = useState('');

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
        }
    };

    const onAskAiToRespond = async () => {
        const sourceId = chat.chat?.references?.sourceId || '';
        try {
            if (chat.chat && chat.chat.id && sourceId) {
                Database.workflows.AskAiToRespondToThread(chat.chat.id, sourceId);
            }
        } catch (error) {}
    };

    const onSendMessage = async () => {
        const sourceId = chat.chat?.references?.sourceId || '';
        try {
            if (chat.chat && chat.chat.id && chat.thread && chat.thread.id && message.trim()) {
                await Database.table.messageThread.addMessage(chat.thread.id, {
                    sourceId: 'USER',
                    status: 'complete',
                    content: { text: message },
                });
                setMessage('');
                await Database.workflows.AskAiToRespondToThread(chat.chat.id, sourceId);
            }
        } catch (error) {}
    };

    const content =
        chat.loading || !chat.chat || !chat.messages || !chat.thread || !chat.model ? (
            <div className="text-text-base">Loading chat data...</div>
        ) : (
            <>
                {chat.messages.map((m, index) => (
                    <ChatMessageSection
                        message={m}
                        key={m.id}
                        showHeader={index === 0 || chat.messages?.at(index - 1)?.sourceId !== m.sourceId}
                    />
                ))}

                {chat.thread.lockingId?.length ? (
                    <div className="flex justify-center my-4">
                        <div className="animate-bounce text-text-dark">
                            <BotIcon />
                        </div>
                    </div>
                ) : (
                    false
                )}

                {chat.thread.lockingId?.length ? (
                    false
                ) : (
                    <>
                        <br />
                        <br />
                        <InputArea
                            value={message}
                            onChange={setMessage}
                            label="Respond"
                            placeholder="Type your message here..."
                            onKeyDown={handleKeyPress}
                        />
                        <div className="flex gap-2 justify-end">
                            <Button onClick={onAskAiToRespond}>Ask AI to respond again</Button>
                            <Button onClick={onSendMessage}>Send your message</Button>
                        </div>
                    </>
                )}
            </>
        );

    const headerReference = (
        <GhostIconButton
            icon={Box}
            onClick={() => navigate(`/models/id/${chat.model?.id}`)}
            tooltip="View model profile"
            className="bg-background-dark"
        />
    );

    return (
        <PageHeader
            title={chat.chat?.name || 'Loading...'}
            icon={getIconForSourceType(chat.chat?.references?.sourceId || '')}
            action={headerReference}
        >
            {content}
        </PageHeader>
    );
}
