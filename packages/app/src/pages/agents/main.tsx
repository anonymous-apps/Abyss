import { Bot, Plus } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GhostIconButton } from '../../library/input/button';
import { IconSection } from '../../library/layout/icon-section';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { WithSidebar } from '../../library/layout/sidebar';
import { Tile, TileGrid } from '../../library/layout/tile-grid';
import { useScanTableAgent, useScanTableAgentToolConnection } from '../../state/database-connection';

export function AgentMainPage() {
    const agents = useScanTableAgent();
    const toolConnections = useScanTableAgentToolConnection();
    const navigate = useNavigate();

    const toolConnectionsForAgent = (agentId: string) => {
        return toolConnections.data?.filter(toolConnection => toolConnection.agentId === agentId);
    };

    return (
        <WithSidebar>
            <PageCrumbed
                title="Agents"
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Agents', url: '/agents' },
                ]}
            >
                <IconSection
                    title="Agents"
                    icon={Bot}
                    action={<GhostIconButton icon={Plus} onClick={() => navigate('/agents/create')} tooltip="Create Agent" />}
                >
                    {agents.data && agents.data.length > 0 ? (
                        <TileGrid>
                            {agents.data.map(agent => (
                                <Tile
                                    key={agent.id}
                                    title={agent.name || 'Untitled'}
                                    href={`/agents/id/${agent.id}`}
                                    icon={<Bot className="w-4 h-4" />}
                                    footer={`${toolConnectionsForAgent(agent.id)?.length} tools`}
                                >
                                    {agent.description || 'No description'}
                                </Tile>
                            ))}
                        </TileGrid>
                    ) : (
                        <div className="text-text-500">No agents found</div>
                    )}
                </IconSection>
            </PageCrumbed>
        </WithSidebar>
    );
}
