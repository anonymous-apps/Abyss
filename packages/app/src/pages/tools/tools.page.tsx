import React from 'react';

import { IconSection, PageCrumbed, Tile, TileGrid } from '@abyss/ui-components';
import { Box, Hammer } from 'lucide-react';
import { useToolsPage } from './tools.hook';

export function ToolsPage() {
    const { breadcrumbs, tools, systemTools, viewTool } = useToolsPage();

    return (
        <PageCrumbed
            title={'Configure Tools'}
            subtitle="Tools allow your agents to take real actions against resources"
            breadcrumbs={breadcrumbs}
        >
            <IconSection icon={Hammer} title="System Tools" subtitle="These are tools built into Abyss for you to use as needed">
                <TileGrid>
                    {systemTools?.map(tool => (
                        <Tile key={tool.id} title={tool.name} onClick={() => viewTool(tool.id)} icon={<Box className="w-4 h-4" />}>
                            {tool.description}
                        </Tile>
                    ))}
                    {systemTools?.length === 0 && (
                        <div className="text-text-700 text-sm">
                            No system tools defined currently, this is an odd state as abyss should create these for you.
                        </div>
                    )}
                </TileGrid>
            </IconSection>
        </PageCrumbed>
    );
}
