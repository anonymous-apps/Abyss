import { Button, IconSection, PageCrumbed, Tile, TileGrid } from '@abyss/ui-components';
import { Bot, Plus } from 'lucide-react';
import React from 'react';
import { useAgentsPage } from './agents-page.hook';

export function AgentsPage() {
    const { agents, toolConnectionsForAgent, handleCreateAgent, navigate } = useAgentsPage();

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
                                footer={`${toolConnectionsForAgent(agent.id)?.length} tools`}
                            >
                                {agent.description || 'No description'}
                            </Tile>
                        ))}
                    </TileGrid>
                ) : (
                    <div className="text-text-700">No agents found</div>
                )}
            </IconSection>
        </PageCrumbed>
    );
}
