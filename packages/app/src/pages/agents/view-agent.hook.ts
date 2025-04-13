import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AgentToolConnectionRecord } from '../../../server/preload/controllers/agent-tool-connection';
import { Database } from '../../main';
import {
    useScanTableAgentToolConnection,
    useScanTableModelConnections,
    useScanTableTool,
    useTableRecordAgent,
} from '../../state/database-connection';

export function useViewAgent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const agent = useTableRecordAgent(id || '');
    const _toolConnections = useScanTableAgentToolConnection();
    const tools = useScanTableTool();
    const modelConnections = useScanTableModelConnections();

    const [toolConnections, setRenderedToolConnections] = useState<AgentToolConnectionRecord[] | undefined>(undefined);
    const [selectedModelId, setSelectedModelId] = useState('');
    const [selectedTools, setSelectedTools] = useState<{ [toolId: string]: { selected: boolean; permission: string } }>({});

    useEffect(() => {
        if (_toolConnections.data) {
            setRenderedToolConnections(_toolConnections.data);
        }
    }, [_toolConnections.data]);

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

    const handleUpdateAgent = (data: Partial<typeof agent.data>) => {
        if (agent.data) {
            Database.table.agent.update(id || '', { ...agent.data, ...data });
        }
    };

    const handleUpdateModelId = (newModelId: string) => {
        setSelectedModelId(newModelId);
        if (agent.data) {
            Database.table.agent.update(id || '', { ...agent.data, chatModelId: newModelId });
        }
    };

    const handleToggleTool = (toolId: string) => {
        const current = selectedTools[toolId];
        if (!current.selected) {
            Database.table.agentToolConnection.create({
                agentId: id || '',
                toolId,
                permission: current.permission,
            });
        } else {
            Database.table.agentToolConnection.delete(toolConnections?.find(conn => conn.toolId === toolId)?.id || '');
        }
    };

    const handleChangeToolPermission = (toolId: string, permission: string) => {
        const connection = toolConnections?.find(conn => conn.toolId === toolId);
        if (connection) {
            Database.table.agentToolConnection.update(connection.id, {
                permission,
            });
        }
    };

    const breadcrumbs = [
        { name: 'Home', onClick: () => navigate('/') },
        { name: 'Agents', onClick: () => navigate('/agents') },
        { name: agent.data?.name || id || '', onClick: () => navigate(`/agents/id/${id}`) },
    ];

    return {
        agent,
        selectedModelId,
        selectedTools,
        modelConnections,
        tools,
        toolConnections,
        breadcrumbs,
        handleUpdateAgent,
        handleUpdateModelId,
        handleToggleTool,
        handleChangeToolPermission,
        handleDelete,
        navigate,
    };
}
