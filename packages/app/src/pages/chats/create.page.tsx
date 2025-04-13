import { Button, ButtonGroup, IconSection, PageCrumbed } from '@abyss/ui-components';
import { Bot, Box, MessageCircle } from 'lucide-react';
import React from 'react';
import { Select } from '../../library/input/select';
import { useChatCreate } from './create.hook';

export function ChatCreatePage() {
    const {
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
    } = useChatCreate();

    const content = (
        <IconSection icon={MessageCircle} title="New Conversation">
            <div className="flex gap-4 mb-4">
                <ButtonGroup>
                    <Button isInactive={chatType !== 'model'} onClick={() => setChatType('model')} icon={Box}>
                        Chat with Model
                    </Button>
                    <Button isInactive={chatType !== 'agent'} onClick={() => setChatType('agent')} icon={Bot}>
                        Chat with Agent
                    </Button>
                </ButtonGroup>
            </div>

            {chatType === 'model' ? (
                <Select
                    label="Choose a model to chat with"
                    value={selectedModel}
                    onChange={setSelectedModel}
                    options={modelOptions}
                    placeholder="Select a model"
                />
            ) : (
                <Select
                    label="Choose an agent to chat with"
                    value={selectedAgent}
                    onChange={setSelectedAgent}
                    options={agentOptions}
                    placeholder="Select an agent"
                />
            )}

            <textarea
                rows={6}
                className="mt-4 w-full bg-background-transparent border border-background-100 rounded px-2 py-1 text-sm focus:outline-none"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Enter your message here"
            />

            <div className="flex justify-end">
                <Button disabled={isSubmitDisabled} onClick={handleSubmit}>
                    Send Message
                </Button>
            </div>
        </IconSection>
    );

    return (
        <PageCrumbed title="New Conversation" breadcrumbs={breadcrumbs}>
            {content}
        </PageCrumbed>
    );
}
