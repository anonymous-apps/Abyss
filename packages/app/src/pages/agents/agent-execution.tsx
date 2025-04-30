import { IconSection, LogView, PageCrumbed } from '@abyss/ui-components';
import { List } from 'lucide-react';
import React from 'react';
import { useAgentExecution } from './agent-execution.hook';

export function AgentExecutionPage() {
    const { execution, breadcrumbs, mappedEvents } = useAgentExecution();
    return (
        <PageCrumbed title="Agent Execution" breadcrumbs={breadcrumbs}>
            <IconSection title="Execution Logs" icon={List}>
                <LogView logs={mappedEvents || []} />
            </IconSection>
        </PageCrumbed>
    );
}
