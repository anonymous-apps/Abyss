import { Bot, Box, CircleHelp, Plus } from 'lucide-react';
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

    const content = !tools.loading && tools.data && (
        <>
            <IconSection
                title="Defined Tool Connections"
                icon={Box}
                action={<GhostIconButton icon={Plus} onClick={() => navigate('/tools/create')} tooltip="Create" />}
            >
                {tools.data && tools.data.length > 0 ? (
                    <TileGrid>
                        {tools.data.map(tool => (
                            <Tile
                                key={tool.id}
                                title={tool.name || 'Untitled'}
                                href={`/tools/id/${tool.id}`}
                                icon={<ToolIconForType type={tool.type} />}
                            >
                                {tool.description || 'No description'}
                            </Tile>
                        ))}
                    </TileGrid>
                ) : (
                    <div className="text-text-700 text-sm mb-4">No defined tools</div>
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

export function ToolIconForType({ type }: { type: string }) {
    switch (type) {
        case 'BUILD-NODE-TOOL':
            return <Bot className="w-4 h-4" />;
        case 'NodeJS':
            return <img src="/nodejs.png" alt="Node.js Tool" className="w-4 h-4" />;
        default:
            return <CircleHelp className="w-4 h-4" />;
    }
}
