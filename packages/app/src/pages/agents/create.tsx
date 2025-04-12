import { Bot, Box, Play } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../library/input/button';
import { Checkbox } from '../../library/input/checkbox';
import { Input } from '../../library/input/input';
import { Select } from '../../library/input/select';
import { IconSection } from '../../library/layout/icon-section';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { WithSidebar } from '../../library/layout/sidebar';
import { Database } from '../../main';
import { useScanTableModelConnections, useScanTableTool } from '../../state/database-connection';

export function AgentCreatePage() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedModelId, setSelectedModelId] = useState('');
    const [selectedTools, setSelectedTools] = useState<{ [toolId: string]: { selected: boolean; permission: string } }>({});

    const navigate = useNavigate();
    const modelConnections = useScanTableModelConnections();
    const tools = useScanTableTool();

    useEffect(() => {
        if (tools.data) {
            const initialSelectedTools: { [toolId: string]: { selected: boolean; permission: string } } = {};
            tools.data.forEach(tool => {
                initialSelectedTools[tool.id] = {
                    selected: false,
                    permission: 'automatic',
                };
            });
            setSelectedTools(initialSelectedTools);
        }
    }, [tools.data]);

    const handleToggleTool = (toolId: string) => {
        setSelectedTools(prev => ({
            ...prev,
            [toolId]: {
                ...prev[toolId],
                selected: !prev[toolId].selected,
            },
        }));
    };

    const handleChangeToolPermission = (toolId: string, permission: string) => {
        setSelectedTools(prev => ({
            ...prev,
            [toolId]: {
                ...prev[toolId],
                permission,
            },
        }));
    };

    const handleCreateAgent = async () => {
        const agent = await Database.table.agent.create({
            name,
            description,
            chatModelId: selectedModelId,
        });

        const toolPromises = Object.entries(selectedTools)
            .filter(([_, value]) => value.selected)
            .map(([toolId, value]) =>
                Database.table.agentToolConnection.create({
                    agentId: agent.id,
                    toolId,
                    permission: value.permission,
                })
            );

        await Promise.all(toolPromises);
        navigate('/agents');
    };

    const isFormValid = name && selectedModelId;

    return (
        <WithSidebar>
            <PageCrumbed
                title="Create Agent"
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Agents', url: '/agents' },
                    { name: 'Create', url: '/agents/create' },
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

                <IconSection title="Model Selection" subtitle="Choose which AI model this agent will use to power it" icon={Box}>
                    <div className="grid grid-cols-1 gap-4 max-w-2xl">
                        {modelConnections.loading ? (
                            <div>Loading models...</div>
                        ) : modelConnections.data && modelConnections.data.length > 0 ? (
                            <Select
                                label="Choose a model"
                                value={selectedModelId}
                                onChange={setSelectedModelId}
                                options={modelConnections.data.map(model => ({
                                    value: model.id,
                                    label: `${model.name}`,
                                }))}
                                placeholder="Select a model"
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
                            <div key={tool.id} className="flex flex-row gap-2 p-4 rounded-md justify-between w-full">
                                <Checkbox
                                    id={`tool-${tool.id}`}
                                    checked={selectedTools[tool.id]?.selected || false}
                                    onChange={checked => handleToggleTool(tool.id)}
                                    label={tool.name}
                                    description={tool.description}
                                />
                                <Select
                                    value={selectedTools[tool.id]?.permission}
                                    onChange={permission => handleChangeToolPermission(tool.id, permission)}
                                    options={[
                                        { value: 'automatic', label: 'Automatic' },
                                        { value: 'user-controlled', label: 'User Controlled' },
                                    ]}
                                    disabled={!selectedTools[tool.id]?.selected}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="text-text-700">No tools found. You can create an agent without tools, or create tools first.</div>
                    )}
                </IconSection>

                <div className="flex justify-start mt-6">
                    <Button
                        onClick={handleCreateAgent}
                        disabled={!isFormValid}
                        className={!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                        Create Agent
                    </Button>
                </div>
            </PageCrumbed>
        </WithSidebar>
    );
}
