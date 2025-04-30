import { AgentGraphExecutionType, AgentGraphType } from '@abyss/records';
import { LogEntry } from '@abyss/ui-components';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useDatabaseRecord } from '../../state/database-connection';

export function useAgentExecution() {
    const { id } = useParams();
    const navigate = useNavigate();

    const execution = useDatabaseRecord<AgentGraphExecutionType>('agentGraphExecution', id);
    const agent = useDatabaseRecord<AgentGraphType>('agentGraph', execution?.agentGraphId);

    const breadcrumbs = [
        { name: 'Home', onClick: () => navigate('/') },
        { name: 'Agents', onClick: () => navigate('/agents') },
        { name: agent?.name!, onClick: () => navigate(`/agents/id/${agent?.id}`) },
        { name: execution?.id!, onClick: () => navigate(`/agents/execution/${execution?.id}`) },
    ];

    const mappedEvents = useMemo((): LogEntry[] => {
        console.log(execution?.events);
        return (
            execution?.events.map(event => {
                return {
                    level: event.level || '',
                    startTime: event.timestamp,
                    scope: event.type || '',
                    message: event.message || '',
                    metadata: event,
                };
            }) || []
        );
    }, [execution]);

    return { execution, breadcrumbs, mappedEvents };
}
