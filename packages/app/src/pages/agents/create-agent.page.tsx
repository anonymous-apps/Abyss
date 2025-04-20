import { Button, Checkbox, IconSection, Input, PageCrumbed, SelectDropdown } from '@abyss/ui-components';
import { Bot, Box, FileText, Play } from 'lucide-react';
import React from 'react';
import { useCreateAgent } from './create-agent.hook';

export function CreateAgentPage() {
    const {
        name,
        setName,
        description,
        setDescription,
        selectedModelId,
        setSelectedModelId,
        selectedTools,
        modelConnections,
        tools,
        handleToggleTool,
        handleCreateAgent,
        isFormValid,
        navigate,
        prompts,
        selectedPromptId,
        setSelectedPromptId,
    } = useCreateAgent();

    return (
        <PageCrumbed
            title="Create Agent"
            breadcrumbs={[
                { name: 'Home', onClick: () => navigate('/') },
                { name: 'Agents', onClick: () => navigate('/agents') },
                { name: 'Create', onClick: () => navigate('/agents/create') },
            ]}
        >
            <IconSection title="Agent Information" subtitle="Configure your agent's basic information" icon={Bot}>
                <div className="flex flex-col gap-4 max-w-2xl">
                    <Input label="Name" value={name} onChange={setName} placeholder="User facing name (not sent to agent)" />
                    <Input
                        label="Description"
                        value={description}
                        onChange={setDescription}
                        placeholder="User facing description (not sent to agent)"
                    />
                </div>
            </IconSection>

            <IconSection title="System Prompt" subtitle="Choose which prompt this agent will use as its system prompt" icon={FileText}>
                <div className="grid grid-cols-1 gap-4 max-w-2xl">
                    {prompts.loading ? (
                        <div>Loading prompts...</div>
                    ) : prompts.data && prompts.data.length > 0 ? (
                        <SelectDropdown
                            selectedId={selectedPromptId}
                            onSelect={setSelectedPromptId}
                            options={prompts.data.map(prompt => ({
                                id: prompt.id,
                                label: prompt.name,
                            }))}
                        />
                    ) : (
                        <div className="text-text-700">No prompts found. Please optionally create a prompt first.</div>
                    )}
                </div>
            </IconSection>

            <IconSection title="Model Selection" subtitle="Choose which AI model this agent will use to power it" icon={Box}>
                <div className="grid grid-cols-1 gap-4 max-w-2xl">
                    {modelConnections.loading ? (
                        <div>Loading models...</div>
                    ) : modelConnections.data && modelConnections.data.length > 0 ? (
                        <SelectDropdown
                            selectedId={selectedModelId}
                            onSelect={setSelectedModelId}
                            options={modelConnections.data.map(model => ({
                                id: model.id,
                                label: `${model.name}`,
                            }))}
                        />
                    ) : (
                        <div className="text-text-700">No model connections found. Please create a model connection first.</div>
                    )}
                </div>
            </IconSection>

            <IconSection
                title="Tool Access"
                subtitle="Configure which tools this agent can use. Tools can be 'automatic' meaning they are invoked whenever the agent asks or they can be 'user-controlled' meaning the user has to approve requests from the agent to invoke the tool on a case-by-case basis."
                icon={Play}
            >
                {tools.loading ? (
                    <div>Loading tools...</div>
                ) : tools.data && tools.data.length > 0 ? (
                    tools.data.map(tool => (
                        <div key={tool.id} className="flex flex-row gap-10 py-4 rounded-md justify-between w-full">
                            <Checkbox
                                checked={selectedTools[tool.id]?.selected || false}
                                onChange={() => handleToggleTool(tool.id)}
                                label={tool.name}
                                description={tool.description.substring(0, 100)}
                                className="capitalize"
                            />
                        </div>
                    ))
                ) : (
                    <div className="text-text-700">No tools found. You can create an agent without tools, or create tools first.</div>
                )}
            </IconSection>

            <div className="flex justify-end mt-6">
                <Button
                    onClick={handleCreateAgent}
                    isDisabled={!isFormValid}
                    className={!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}
                >
                    Create Agent
                </Button>
            </div>
        </PageCrumbed>
    );
}
