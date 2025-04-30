import { useNavigate } from 'react-router-dom';
import { Database } from '../../main';
import { useScanTableAgents } from '../../state/database-access-utils';

export function useAgentsPage() {
    const agents = useScanTableAgents();
    const navigate = useNavigate();

    const handleCreateAgent = async () => {
        const agent = await Database.table.agentGraph.create({
            name: 'New Agent',
            description: 'New Agent',
            nodes: [],
            edges: [],
        });
        navigate(`/agents/id/${agent.id}`);
    };

    return {
        agents,
        handleCreateAgent,
        navigate,
    };
}
