import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database } from '../../main';
import { useScanTableModelConnections, useScanTableTool } from '../../state/database-connection';

export function useCreateAgent() {
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

    return {
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
        handleChangeToolPermission,
        handleCreateAgent,
        isFormValid,
    };
}
