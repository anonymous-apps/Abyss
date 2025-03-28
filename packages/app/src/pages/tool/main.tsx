import { Box, Hammer, Plus } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GhostIconButton } from '../../library/input/button';
import { IconSection } from '../../library/layout/icon-section';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { WithSidebar } from '../../library/layout/sidebar';
import { Tile, TileGrid } from '../../library/layout/tile-grid';
import { useScanTableTool } from '../../state/database-connection';

export function ToolsPage() {
    const tools = useScanTableTool();
    const navigate = useNavigate();

    const systemTools = tools.data?.filter(tool => tool.type === 'SYSTEM');
    const localTools = tools.data?.filter(tool => tool.type === 'USER');

    const content = !tools.loading && tools.data && (
        <>
            <IconSection
                title="Defined Local Tools"
                icon={Box}
                action={<GhostIconButton icon={Plus} onClick={() => navigate('/tools/create')} tooltip="Create" />}
            >
                {localTools && localTools.length > 0 ? (
                    <TileGrid>
                        {localTools.map(tool => (
                            <Tile
                                key={tool.id}
                                title={tool.name || 'Untitled'}
                                href={`/tools/id/${tool.id}`}
                                icon={<Box className="w-4 h-4" />}
                                footer={tool.type}
                            >
                                {tool.description || 'No description'}
                            </Tile>
                        ))}
                    </TileGrid>
                ) : (
                    <div className="text-text-500 text-sm mb-4">No defined tools</div>
                )}
            </IconSection>

            <IconSection title="Defined System Tools" icon={Hammer}>
                {systemTools && systemTools.length > 0 ? (
                    <TileGrid>
                        {systemTools.map(tool => (
                            <Tile
                                key={tool.id}
                                title={tool.name || 'Untitled'}
                                href={`/tools/id/${tool.id}`}
                                icon={<Hammer className="w-4 h-4" />}
                                footer={tool.type}
                            >
                                {tool.description.substring(0, 100) || 'No description'}
                            </Tile>
                        ))}
                    </TileGrid>
                ) : (
                    <div className="text-text-500 text-sm mb-4  ">No defined tools</div>
                )}
            </IconSection>
        </>
    );

    return (
        <WithSidebar>
            <PageCrumbed
                title="Defined Tools"
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Tools', url: '/tools' },
                ]}
            >
                {content}
            </PageCrumbed>
        </WithSidebar>
    );
}
