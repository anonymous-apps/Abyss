import { Bot, Box, MessageCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../library/input/button';
import { Select } from '../../library/input/select';
import { IconSection } from '../../library/layout/icon-section';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { Database } from '../../main';
import { useScanTableAgent, useScanTableModelConnections } from '../../state/database-connection';

export function ChatCreatePage() {
    const navigate = useNavigate();

    const allModels = useScanTableModelConnections();
    const allAgents = useScanTableAgent();

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
        const sourceType = chatType === 'model' ? 'chatModel' : 'agent';
        const sourceName =
            chatType === 'model'
                ? allModels.data?.find(model => model.id === selectedModel)?.name
                : allAgents.data?.find(agent => agent.id === selectedAgent)?.name;

        if (sourceId && message) {
            const chatRecord = await Database.table.chat.createWithThread({
                name: 'New Chat',
                type: sourceType,
                sourceId: sourceId,
                description: 'New chat with ' + sourceName,
            });
            await Database.table.messageThread.addMessage(chatRecord.threadId, {
                type: 'USER',
                sourceId: 'USER',
                content: message,
            });

            Database.workflows.AskAiToRespondToChat(chatRecord.id);
            navigate(`/chats/id/${chatRecord.id}`);
        }
    };

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Chats', url: '/chats' },
        { name: 'New Conversation', url: '/chats/create' },
    ];

    const content = (
        <IconSection icon={MessageCircle} title="New Conversation">
            <div className="flex gap-4 mb-4">
                <Button
                    onClick={() => setChatType('model')}
                    className={`flex items-center gap-2 ${
                        chatType === 'model' ? 'bg-primary-base text-text-light' : 'bg-background-light'
                    }`}
                >
                    <Box className="w-4 h-4" /> Chat with Model
                </Button>
                <Button
                    onClick={() => setChatType('agent')}
                    className={`flex items-center gap-2 ${
                        chatType === 'agent' ? 'bg-primary-base text-text-light' : 'bg-background-light'
                    }`}
                >
                    <Bot className="w-4 h-4" /> Chat with Agent
                </Button>
            </div>

            {chatType === 'model' ? (
                <Select
                    label="Choose a model to chat with"
                    value={selectedModel}
                    onChange={setSelectedModel}
                    options={allModels.data?.map(model => ({ value: model.id, label: model.name })) || []}
                    placeholder="Select a model"
                />
            ) : (
                <Select
                    label="Choose an agent to chat with"
                    value={selectedAgent}
                    onChange={setSelectedAgent}
                    options={allAgents.data?.map(agent => ({ value: agent.id, label: agent.name })) || []}
                    placeholder="Select an agent"
                />
            )}

            <textarea
                rows={6}
                className="mt-4 w-full bg-background-transparent border border-background-light rounded px-2 py-1 text-sm focus:outline-none"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Enter your message here"
            />
            <Button disabled={chatType === 'model' ? !selectedModel : !selectedAgent} onClick={handleSubmit}>
                Start Chat
            </Button>
        </IconSection>
    );

    return (
        <PageCrumbed title="New Conversation" breadcrumbs={breadcrumbs}>
            {content}
        </PageCrumbed>
    );
}
