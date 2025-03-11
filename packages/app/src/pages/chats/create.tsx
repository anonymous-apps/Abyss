import React, { useEffect, useState } from 'react';
import { PageCenter } from '../../library/layout/page-center';
import { useDatabaseQuery, useDatabaseTableSubscription } from '../../state/database-connection';
import { Select } from '../../library/input/select';
import { Database } from '../../main';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../library/input/button';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { WithSidebar } from '../../library/layout/sidebar';

export function ChatCreatePage() {
    const allModels = useDatabaseTableSubscription('ModelConnections', async database => database.table.modelConnections.findMany());
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        if (allModels.data) {
            if (allModels.data.length) {
                setSelectedModel(allModels.data[0].id);
            }
        }
    }, [allModels.data]);

    const handleSubmit = async () => {
        if (selectedModel && message) {
            const chatRecord = await Database.table.chat.createWithThread({
                name: 'New Chat',
                assistantId: selectedModel,
            });
            await Database.table.messageThread.addMessage(chatRecord.threadId, {
                role: 'USER',
                source: 'USER',
                content: message,
            });

            Database.workflows.titleConversation(chatRecord.id);
            Database.workflows.askAIToRespondToChat(chatRecord.id);
            navigate(`/chats/id/${chatRecord.id}`);
        }
    };

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Chats', url: '/chats' },
        { name: 'New Conversation', url: '/chats/create' },
    ];

    const content = (
        <>
            <div className="text-xl font-bold">Start new chat</div>
            <Select
                label="Choose what to chat with"
                value={selectedModel}
                onChange={setSelectedModel}
                options={allModels.data?.map(model => ({ value: model.id, label: model.name })) || []}
                placeholder="Select a model"
            />
            <textarea
                rows={6}
                className="mt-4 w-full bg-background-transparent border border-background-light rounded px-2 py-1 text-sm focus:outline-none"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Enter your message here"
            />
            <Button disabled={!selectedModel} onClick={handleSubmit}>
                Start Chat
            </Button>
        </>
    );

    return (
        <PageCrumbed title="New Conversation" breadcrumbs={breadcrumbs}>
            {content}
        </PageCrumbed>
    );
}
