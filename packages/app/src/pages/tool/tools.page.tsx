import { IconSection, PageCrumbed, Tile, TileGrid } from '@abyss/ui-components';
import { Box } from 'lucide-react';
import React from 'react';
import { ToolIcon } from '../../library/icons';
import { useToolsPage } from './tools.hook';

export function ToolsPage() {
    const { tools, navigateToTool, breadcrumbs } = useToolsPage();

    return (
        <PageCrumbed title="Defined Tool Connections" breadcrumbs={breadcrumbs}>
            <IconSection title="Defined Tool Connections" icon={Box}>
                {tools.data && tools.data.length > 0 ? (
                    <TileGrid>
                        {tools.data.map(tool => (
                            <Tile
                                key={tool.id}
                                title={tool.name || 'Untitled'}
                                onClick={() => navigateToTool(tool.id)}
                                icon={<ToolIcon type={tool.type} />}
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
