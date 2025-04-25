import { useNavigate } from 'react-router-dom';
import { Database } from '../../main';
import { useScanTableAgent, useScanTableAgentToolConnection } from '../../state/database-connection';

export function useAgentsPage() {
    const agents = useScanTableAgent();
    const toolConnections = useScanTableAgentToolConnection();
    const navigate = useNavigate();

    const toolConnectionsForAgent = (agentId: string) => {
        return toolConnections.data?.filter(toolConnection => toolConnection.agentId === agentId);
    };

    const handleCreateAgent = async () => {
        const agent = await Database.table.agent.create({
            name: 'New Agent',
            description: 'New Agent',
            graph: {
                nodes: [],
                edges: [],
            },
        });
        navigate(`/agents/id/${agent.id}`);
    };

    return {
        agents,
        toolConnectionsForAgent,
        handleCreateAgent,
        navigate,
    };
}
