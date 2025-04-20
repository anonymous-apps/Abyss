import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Database } from '../../main';
import { useChatData } from '../../state/hooks/useChat';

export function useChatView() {
    const { id } = useParams();
    const navigate = useNavigate();

    const chat = useChatData(id || '');
    const [message, setMessage] = useState('');

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
        }
    };

    const onAskAiToRespond = async () => {
        const sourceId = chat.chat?.references?.sourceId || '';
        if (!chat.chat || !chat.chat.id || !sourceId) {
            return;
        }

        Database.workflows.AskAiToRespondToThread(chat.chat.id, sourceId);
    };

    const onSendMessage = async () => {
        const sourceId = chat.chat?.references?.sourceId || '';
        try {
            if (chat.chat && chat.chat.id && chat.thread && chat.thread.id && message.trim()) {
                await Database.table.messageThread.addMessage(chat.thread.id, {
                    sourceId: 'USER',
                    content: { text: message },
                });
                setMessage('');
                await Database.workflows.AskAiToRespondToThread(chat.chat.id, sourceId);
            }
        } catch (error) {}
    };

    const navigateToModel = () => {
        navigate(`/models/id/${chat.model?.id}`);
    };

    const navigateToHome = () => {
        navigate('/');
    };

    const navigateToChats = () => {
        navigate('/chats');
    };

    const breadcrumbs = [
        { name: 'Home', onClick: navigateToHome },
        { name: 'Chats', onClick: navigateToChats },
        { name: chat.chat?.name || 'Chat', onClick: () => {} },
    ];

    return {
        chat,
        message,
        setMessage,
        handleKeyPress,
        onAskAiToRespond,
        onSendMessage,
        navigateToModel,
        isTyping: !!chat.thread?.lockingId?.length,
        breadcrumbs,
        navigateToHome,
        navigateToChats,
    };
}
