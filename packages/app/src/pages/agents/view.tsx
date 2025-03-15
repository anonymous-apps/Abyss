import { Bot, Box, Play, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AgentToolConnectionRecord } from '../../../server/preload/controllers/agent-tool-connection';
import { DestructiveButton } from '../../library/input/button';
import { Checkbox } from '../../library/input/checkbox';
import { EditableLabelValue } from '../../library/input/label-value';
import { Select } from '../../library/input/select';
import { IconSection } from '../../library/layout/icon-section';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { WithSidebar } from '../../library/layout/sidebar';
import { Database } from '../../main';
import {
    useScanTableAgentToolConnection,
    useScanTableModelConnections,
    useScanTableTool,
    useTableRecordAgent,
} from '../../state/database-connection';

export function AgentViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const agent = useTableRecordAgent(id || '');
    const _toolConnections = useScanTableAgentToolConnection();
    const tools = useScanTableTool();
    const modelConnections = useScanTableModelConnections();

    const [toolConnections, setRenderedToolConnections] = useState<AgentToolConnectionRecord[] | undefined>(undefined);
    useEffect(() => {
        if (_toolConnections.data) {
            setRenderedToolConnections(_toolConnections.data);
        }
    }, [_toolConnections.data]);

    const [selectedModelId, setSelectedModelId] = useState('');
    const [selectedTools, setSelectedTools] = useState<{ [toolId: string]: { selected: boolean; permission: string } }>({});

    useEffect(() => {
        if (agent.data) {
            setSelectedModelId(agent.data.chatModelId);
        }
    }, [agent.data]);

    useEffect(() => {
        if (tools.data) {
            const initialSelectedTools: { [toolId: string]: { selected: boolean; permission: string } } = {};

            tools.data.forEach(tool => {
                initialSelectedTools[tool.id] = {
                    selected: false,
                    permission: 'automatic',
                };
            });

            toolConnections
                ?.filter(connection => connection.agentId === id)
                .forEach(connection => {
                    initialSelectedTools[connection.toolId] = {
                        selected: true,
                        permission: connection.permission,
                    };
                });

            setSelectedTools(initialSelectedTools);
        }
    }, [tools.data, toolConnections, id]);

    const handleDelete = async () => {
        if (!id) return;

        // First delete all tool connections
        const connections = toolConnections?.filter(conn => conn.agentId === id) || [];
        await Promise.all(connections.map(conn => Database.table.agentToolConnection.delete(conn.id)));

        // Then delete the agent
        await Database.table.agent.delete(id);
        navigate('/agents');
    };

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Agents', url: '/agents' },
        { name: agent.data?.name || id || '', url: `/agents/id/${id}` },
    ];

    const content = !agent.data ? (
        <div className="text-text-base">Loading agent data...</div>
    ) : (
        <>
            <IconSection title="Agent Information" icon={Bot}>
                <EditableLabelValue
                    data={{
                        name: agent.data.name,
                        description: agent.data.description,
                    }}
                    editableKeys={['name', 'description']}
                    onChange={data => {
                        Database.table.agent.update(id || '', { ...agent.data, ...data });
                    }}
                />
            </IconSection>

            <IconSection title="Model Configuration" icon={Box}>
                <div className="flex flex-col gap-4 max-w-2xl">
                    <Select
                        label="Choose a model"
                        value={selectedModelId}
                        onChange={newModelId => {
                            setSelectedModelId(newModelId);
                            Database.table.agent.update(id || '', { ...agent.data, chatModelId: newModelId });
                        }}
                        options={
                            modelConnections.data?.map(model => ({
                                value: model.id,
                                label: model.name,
                            })) || []
                        }
                        placeholder="Select a model"
                    />
                </div>
            </IconSection>

            <IconSection title="Tool Configuration" icon={Play}>
                {!tools.loading && toolConnections ? (
                    <div className="grid grid-cols-1 gap-4">
                        {tools.data?.map(tool => (
                            <div key={tool.id} className="flex flex-row gap-2 p-4 rounded-md justify-between w-full">
                                <Checkbox
                                    id={`tool-${tool.id}`}
                                    checked={selectedTools[tool.id]?.selected || false}
                                    onChange={() => {
                                        const current = selectedTools[tool.id];
                                        if (!current.selected) {
                                            Database.table.agentToolConnection.create({
                                                agentId: id || '',
                                                toolId: tool.id,
                                                permission: current.permission,
                                            });
                                        } else {
                                            Database.table.agentToolConnection.delete(
                                                toolConnections?.find(conn => conn.toolId === tool.id)?.id || ''
                                            );
                                        }
                                    }}
                                    label={tool.name}
                                    description={tool.description}
                                />
                                <Select
                                    value={selectedTools[tool.id]?.permission || 'automatic'}
                                    onChange={permission => {
                                        const connection = toolConnections?.find(conn => conn.toolId === tool.id);
                                        if (connection) {
                                            Database.table.agentToolConnection.update(connection.id, {
                                                permission,
                                            });
                                        }
                                    }}
                                    options={[
                                        { value: 'automatic', label: 'Automatic' },
                                        { value: 'user-controlled', label: 'User Controlled' },
                                    ]}
                                    disabled={!selectedTools[tool.id]?.selected}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>Loading tool configuration...</div>
                )}
            </IconSection>

            <IconSection title="Danger Zone" icon={Trash2}>
                <DestructiveButton onClick={handleDelete}>Delete Agent</DestructiveButton>
            </IconSection>
        </>
    );

    return (
        <WithSidebar>
            <PageCrumbed title={`Agent: ${agent.data?.name || 'Loading...'}`} breadcrumbs={breadcrumbs}>
                {content}
            </PageCrumbed>
        </WithSidebar>
    );
}
