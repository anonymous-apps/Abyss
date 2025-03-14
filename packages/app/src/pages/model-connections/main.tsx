import { ModelConnections } from '@prisma/client';
import { Box, Plus } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GhostIconButton } from '../../library/input/button';
import { IconSection } from '../../library/layout/icon-section';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { useDatabaseTableSubscription } from '../../state/database-connection';
import { WithSidebar } from '../../library/layout/sidebar';
import { TileGrid, Tile } from '../../library/layout/tile-grid';

export function ModelProfileMainPage() {
    // Subscribe to the model profiles table and get the data whenever it changes
    const ModelProfiles = useDatabaseTableSubscription('ModelConnections', async database => database.table.modelConnections.scanTable());

    // Navigate to the model profile page
    const navigate = useNavigate();

    const createModelProfileElement = () => {
        return <GhostIconButton icon={Plus} onClick={() => navigate('/model-connection/create')} />;
    };

    return (
        <WithSidebar>
            <PageCrumbed
                title="Connected Models"
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Models', url: '/model-connection' },
                ]}
            >
                <IconSection title="Connected Models" icon={Box} action={createModelProfileElement()}>
                    {ModelProfiles.data && ModelProfiles.data.length > 0 ? (
                        <TileGrid>
                            {ModelProfiles.data.map(model => (
                                <Tile
                                    key={model.id}
                                    title={model.name || 'Untitled'}
                                    href={`/model-connection/id/${model.id}`}
                                    icon={<Box className="w-4 h-4" />}
                                    footer={model.provider}
                                >
                                    {model.modelId || 'No model ID specified'}
                                </Tile>
                            ))}
                        </TileGrid>
                    ) : (
                        <div className="text-text-500">No model profiles found</div>
                    )}
                </IconSection>
            </PageCrumbed>
        </WithSidebar>
    );
}
