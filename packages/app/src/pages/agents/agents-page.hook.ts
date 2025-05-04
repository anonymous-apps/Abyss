import { formatRelative } from 'date-fns';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database } from '../../main';
import { useScanTableAgentExecutions, useScanTableAgents } from '../../state/database-access-utils';

export function useAgentsPage() {
    const agents = useScanTableAgents();
    const executions = useScanTableAgentExecutions();
    const navigate = useNavigate();

    const onOpenRecordStr = (record: string) => {
        if (record.startsWith('agentGraphExecution::')) {
            navigate(`/agents/execution/${record}`);
        } else if (record.startsWith('agentGraph::')) {
            navigate(`/agents/id/${record}`);
        }
    };

    const executionTableData = useMemo(() => {
        const results: Record<string, any>[] = [];
        for (const execution of executions.data || []) {
            results.push({
                status: execution.status,
                id: execution.id,
                startTime: formatRelative(execution.startTime, new Date()),
                agentGraphId: execution.agentGraphId,
            });
        }
        return results;
    }, [executions.data]);

    const handleCreateAgent = async () => {
        const agent = await Database.tables.agentGraph.create({
            name: 'New Agent',
            description: 'New Agent',
            nodesData: [],
            edgesData: [],
        });
        navigate(`/agents/id/${agent.id}`);
    };

    return {
        agents,
        executions,
        executionTableData,
        handleCreateAgent,
        navigate,
        onOpenRecordStr,
    };
}
