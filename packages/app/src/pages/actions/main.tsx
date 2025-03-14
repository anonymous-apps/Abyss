import { Box, Hammer, Plus } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconSection } from '../../library/layout/icon-section';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { useDatabaseTableSubscription } from '../../state/database-connection';
import { WithSidebar } from '../../library/layout/sidebar';
import { TileGrid, Tile } from '../../library/layout/tile-grid';
import { GhostIconButton } from '../../library/input/button';

export function ActionsPage() {
    // Subscribe to the actions table and get the data whenever it changes
    const Actions = useDatabaseTableSubscription('ActionDefinitions', async database => database.table.actionDefinitions.scanTable());
    const navigate = useNavigate();

    const systemActions = Actions.data?.filter(action => action.owner === 'SYSTEM');
    const localActions = Actions.data?.filter(action => action.owner === 'USER');

    const createActionElement = () => {
        return <GhostIconButton icon={Plus} onClick={() => navigate('/actions/create')} />;
    };

    const content = !Actions.loading && Actions.data && (
        <>
            <IconSection title="Defined Local Actions" icon={Box} action={createActionElement()}>
                {localActions && localActions.length > 0 ? (
                    <TileGrid>
                        {localActions.map(action => (
                            <Tile
                                key={action.id}
                                title={action.name || 'Untitled'}
                                href={`/actions/id/${action.id}`}
                                icon={<Box className="w-4 h-4" />}
                                footer={action.type}
                            >
                                {action.description || 'No description'}
                            </Tile>
                        ))}
                    </TileGrid>
                ) : (
                    <div className="text-text-500 text-sm mb-4">No defined actions</div>
                )}
            </IconSection>

            <IconSection title="Defined System Actions" icon={Hammer}>
                {systemActions && systemActions.length > 0 ? (
                    <TileGrid>
                        {systemActions.map(action => (
                            <Tile
                                key={action.id}
                                title={action.name || 'Untitled'}
                                href={`/actions/id/${action.id}`}
                                icon={<Hammer className="w-4 h-4" />}
                                footer={action.type}
                            >
                                {action.description || 'No description'}
                            </Tile>
                        ))}
                    </TileGrid>
                ) : (
                    <div className="text-text-500 text-sm mb-4  ">No defined actions</div>
                )}
            </IconSection>
        </>
    );

    return (
        <WithSidebar>
            <PageCrumbed
                title="Integrated Actions"
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Actions', url: '/actions' },
                ]}
            >
                {content}
            </PageCrumbed>
        </WithSidebar>
    );
}
