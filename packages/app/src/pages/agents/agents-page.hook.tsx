import { Status } from '@abyss/ui-components';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database } from '../../main';
import { useScanLogOfType, useScanTableAgents } from '../../state/database-access-utils';
import { formatDuration } from '../../utils/time';

export function useAgentsPage() {
    const agents = useScanTableAgents();
    const executions = useScanLogOfType('graphExecution');
    const navigate = useNavigate();

    const onOpenRecordStr = (record: string) => {
        if (record.startsWith('logStream::')) {
            navigate(`/logs/id/${record}`);
        } else if (record.startsWith('agentGraph::')) {
            navigate(`/agents/id/${record}`);
        }
    };

    const executionTableData = useMemo(() => {
        const results: Record<string, any>[] = [];
        for (const execution of executions.data || []) {
            results.push({
                status: <Status status={execution.status} />,
                start: new Date(execution.createdAt).toLocaleString(),
                duration: execution.completedAt ? formatDuration(execution.completedAt - execution.createdAt) : 'ongoing',
                agent: execution.sourceId,
                log: execution.id,
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
