import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database } from '../../main';
import { useScanTableAgents, useScanTableModelConnections } from '../../state/database-access-utils';

export function useChatCreate() {
    const navigate = useNavigate();
    const allModels = useScanTableModelConnections();
    const allAgents = useScanTableAgents();

    const [chatType, setChatType] = useState<'model' | 'agent'>('model');
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [selectedAgent, setSelectedAgent] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        if (allModels.data && allModels.data.length && chatType === 'model') {
            setSelectedModel(allModels.data[0].id);
        }
        if (allAgents.data && allAgents.data.length && chatType === 'agent') {
            setSelectedAgent(allAgents.data[0].id);
        }
    }, [allModels.data, allAgents.data, chatType]);

    const handleSubmit = async () => {
        const sourceId = chatType === 'model' ? selectedModel : selectedAgent;
        if (!sourceId || !message) {
            return;
        }
        const chatRecord = await Database.table.chatThread.new(sourceId);
        const messageThread = await Database.table.messageThread.getOrThrow(chatRecord.threadId);
        const messageThreadWithUserMessage = await messageThread.addHumanPartial({
            type: 'text',
            payload: {
                content: message,
            },
        });
        await chatRecord.setThreadId(messageThreadWithUserMessage.id);
        navigate(`/chats/id/${chatRecord.id}`);
    };

    const breadcrumbs = [
        { name: 'Home', onClick: () => navigate('/') },
        { name: 'Chats', onClick: () => navigate('/chats') },
        { name: 'New Conversation', onClick: () => navigate('/chats/create') },
    ];

    const modelOptions =
        allModels.data?.map(model => ({
            value: model.id,
            label: model.name,
        })) || [];

    const agentOptions =
        allAgents.data?.map(agent => ({
            value: agent.id,
            label: agent.name,
        })) || [];

    const isSubmitDisabled = chatType === 'model' ? !selectedModel : !selectedAgent;

    return {
        chatType,
        setChatType,
        selectedModel,
        setSelectedModel,
        selectedAgent,
        setSelectedAgent,
        message,
        setMessage,
        handleSubmit,
        breadcrumbs,
        modelOptions,
        agentOptions,
        isSubmitDisabled,
    };
}
