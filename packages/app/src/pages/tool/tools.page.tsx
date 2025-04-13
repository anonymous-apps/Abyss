import { IconSection, PageCrumbed } from '@abyss/ui-components';
import { Bot, Box, CircleHelp } from 'lucide-react';
import React from 'react';
import { Tile, TileGrid } from '../../library/layout/tile-grid';
import { useToolsPage } from './tools.hook';

export function ToolsPage() {
    const { tools, navigateToCreate, navigate } = useToolsPage();

    return (
        <PageCrumbed
            title="Defined Tools"
            breadcrumbs={[
                { name: 'Home', onClick: () => navigate('/') },
                { name: 'Tools', onClick: () => navigate('/tools') },
            ]}
        >
            <IconSection title="Defined Tool Connections" icon={Box}>
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
        </PageCrumbed>
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
