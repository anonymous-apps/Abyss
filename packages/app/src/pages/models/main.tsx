import { Box, Plus } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GhostIconButton } from '../../library/input/button';
import { IconSection } from '../../library/layout/icon-section';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { WithSidebar } from '../../library/layout/sidebar';
import { Tile, TileGrid } from '../../library/layout/tile-grid';
import { ProviderLogo } from '../../library/logos';
import { useScanTableModelConnections } from '../../state/database-connection';

export function ModelProfileMainPage() {
    const ModelProfiles = useScanTableModelConnections();
    const navigate = useNavigate();

    return (
        <WithSidebar>
            <PageCrumbed
                title="Connected Models"
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Models', url: '/models' },
                ]}
            >
                <IconSection
                    title="Connected Models"
                    icon={Box}
                    action={<GhostIconButton icon={Plus} onClick={() => navigate('/models/create')} tooltip="New Connection" />}
                >
                    {ModelProfiles.data && ModelProfiles.data.length > 0 ? (
                        <TileGrid>
                            {ModelProfiles.data.map(model => (
                                <Tile
                                    key={model.id}
                                    title={model.name || 'Untitled'}
                                    href={`/models/id/${model.id}`}
                                    icon={<Box className="w-4 h-4" />}
                                    footer={<ProviderLogo provider={model.provider} className="w-6 h-6" />}
                                >
                                    {model.description}
                                </Tile>
                            ))}
                        </TileGrid>
                    ) : (
                        <div className="text-text-700">No model profiles found</div>
                    )}
                </IconSection>
            </PageCrumbed>
        </WithSidebar>
    );
}
