import { ActionDefinitions } from '@prisma/client';
import { Box, Plus } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GhostIconButton } from '../../library/input/button';
import { IconSection } from '../../library/layout/icon-section';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { useDatabaseTableSubscription } from '../../state/database-connection';
import { WithSidebar } from '../../library/layout/sidebar';

function ActionCard({ action }: { action: ActionDefinitions }) {
    const navigate = useNavigate();
    return (
        <div
            className="flex flex-row gap-3 mb-2 p-2 rounded border border-background-light hover:border-primary-base transition-colors cursor-pointer items-center"
            onClick={() => navigate(`/actions/id/${action.id}`)}
        >
            <div className="capitalize">{action.name || 'Untitled'}</div>
            <div className="opacity-50 text-xs">({action.type})</div>
        </div>
    );
}

export function ActionsPage() {
    // Subscribe to the actions table and get the data whenever it changes
    const Actions = useDatabaseTableSubscription('ActionDefinitions', async database => database.table.actionDefinitions.scanTable());

    // Navigate to the action creation page
    const navigate = useNavigate();

    const createActionElement = () => {
        return <GhostIconButton icon={Plus} onClick={() => navigate('/actions/create')} />;
    };

    return (
        <WithSidebar>
            <PageCrumbed
                title="Integrated Actions"
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Actions', url: '/actions' },
                ]}
            >
                <IconSection title="Defined Local Actions" icon={Box} action={createActionElement()}>
                    {Actions.data?.map(action => (
                        <ActionCard key={action.id} action={action} />
                    ))}
                    {Actions.data?.length === 0 && <div className="text-text-500 text-sm">No defined actions</div>}
                </IconSection>
            </PageCrumbed>
        </WithSidebar>
    );
}
