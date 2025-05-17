import { Button, IconSection, PageCrumbed, Table, Tile, TileGrid } from '@abyss/ui-components';
import { Bot, List, Plus } from 'lucide-react';
import { useAgentsPage } from './agents-page.hook';

export function AgentsPage() {
    const { agents, handleCreateAgent, navigate, executionTableData, onOpenRecordStr } = useAgentsPage();

    return (
        <PageCrumbed
            title="Agents"
            subtitle="Agents are built through a node based orchestrated UI, allowing for complex workflows to be created seamlessly."
            breadcrumbs={[
                { name: 'Home', onClick: () => navigate('/') },
                { name: 'Agents', onClick: () => navigate('/agents') },
            ]}
        >
            <IconSection
                title="Agents"
                icon={Bot}
                action={<Button variant="secondary" icon={Plus} onClick={handleCreateAgent} tooltip="Create Agent" />}
            >
                {agents.data && agents.data.length > 0 ? (
                    <TileGrid>
                        {agents.data.map(agent => (
                            <Tile
                                key={agent.id}
                                title={agent.name || 'Untitled'}
                                onClick={() => navigate(`/agents/id/${agent.id}`)}
                                icon={<Bot className="w-4 h-4" />}
                                footer={`${agent.nodesData.length} nodes`}
                            />
                        ))}
                    </TileGrid>
                ) : (
                    <div className="text-text-700">No agents found, create a new agent graph to get started.</div>
                )}
            </IconSection>

            <IconSection title="Executions" icon={List}>
                <Table
                    table={'agentGraphExecution'}
                    data={executionTableData as Record<string, any>[]}
                    onRecordClick={recordId => onOpenRecordStr(recordId)}
                />
            </IconSection>
        </PageCrumbed>
    );
}
