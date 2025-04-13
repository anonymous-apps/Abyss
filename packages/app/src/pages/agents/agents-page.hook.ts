import { useNavigate } from 'react-router-dom';
import { useScanTableAgent, useScanTableAgentToolConnection } from '../../state/database-connection';

export function useAgentsPage() {
    const agents = useScanTableAgent();
    const toolConnections = useScanTableAgentToolConnection();
    const navigate = useNavigate();

    const toolConnectionsForAgent = (agentId: string) => {
        return toolConnections.data?.filter(toolConnection => toolConnection.agentId === agentId);
    };

    const handleCreateAgent = () => {
        navigate('/agents/create');
    };

    return {
        agents,
        toolConnectionsForAgent,
        handleCreateAgent,
        navigate,
    };
}
