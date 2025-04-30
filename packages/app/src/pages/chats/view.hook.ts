import { ChatThreadRecord, MessageThreadRecord } from '@abyss/records';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDatabaseRecord } from '../../state/database-connection';
import { chatWithAgentGraph, chatWithAiModel } from '../../state/operations';

export function useChatView() {
    const { id } = useParams();
    const navigate = useNavigate();

    const chat = useDatabaseRecord<ChatThreadRecord>('chatThread', id);
    const thread = useDatabaseRecord<MessageThreadRecord>('messageThread', chat?.threadId);

    const [message, setMessage] = useState('');

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
        }
    };

    const navigateToHome = () => {
        navigate('/');
    };

    const navigateToChats = () => {
        navigate('/chats');
    };

    const navigateToParticipant = () => {
        if (chat?.participantId) {
            if (chat.participantId.startsWith('modelConnection::')) {
                navigate(`/database/id/modelConnection/record/${chat.participantId}`);
            } else if (chat.participantId.startsWith('agentGraph::')) {
                navigate(`/database/id/agentGraph/record/${chat.participantId}`);
            }
        }
    };

    const handleSendMessage = () => {
        if (message.trim() === '') {
            return;
        }
        setMessage('');
        if (chat?.participantId?.startsWith('modelConnection::')) {
            chatWithAiModel(message, chat?.participantId || '', chat?.id || '');
        } else {
            chatWithAgentGraph(message, chat?.participantId || '', chat?.id || '');
        }
    };

    const breadcrumbs = [
        { name: 'Home', onClick: navigateToHome },
        { name: 'Chats', onClick: navigateToChats },
        { name: chat?.name || 'Chat', onClick: () => {} },
    ];

    return {
        chat,
        thread,
        message,
        setMessage,
        handleKeyPress,
        navigateToParticipant,
        breadcrumbs,
        navigateToHome,
        navigateToChats,
        handleSendMessage,
    };
}
