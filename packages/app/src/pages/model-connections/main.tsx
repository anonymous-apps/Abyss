import { ModelConnections } from '@prisma/client';
import { Box, Plus } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GhostIconButton, IconButton } from '../../library/input/button';
import { IconSection } from '../../library/layout/icon-section';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { useDatabaseTableSubscription } from '../../state/database-connection';

function ModelProfileCard({ model }: { model: ModelConnections }) {
    const navigate = useNavigate();
    return (
        <div
            className="flex flex-row gap-3 mb-2 p-2 rounded border border-background-light hover:border-primary-base transition-colors cursor-pointer items-center"
            onClick={() => navigate(`/model-connection/id/${model.id}`)}
        >
            <div className=" capitalize">{model.name || 'Untitled'}</div>
            <div className="opacity-50 text-xs">({model.provider})</div>
        </div>
    );
}

export function ModelProfileMainPage() {
    // Subscribe to the model profiles table and get the data whenever it changes
    const ModelProfiles = useDatabaseTableSubscription('ModelConnections', async database => database.table.modelConnections.scanTable());

    // Navigate to the model profile page
    const navigate = useNavigate();

    const createModelProfileElement = () => {
        return <GhostIconButton icon={Plus} onClick={() => navigate('/model-connection/create')} />;
    };

    return (
        <PageCrumbed
            title="Connected Models"
            breadcrumbs={[
                { name: 'Home', url: '/' },
                { name: 'Models', url: '/model-connection' },
            ]}
        >
            <IconSection title="Connected Models" icon={Box} action={createModelProfileElement()}>
                {ModelProfiles.data?.map(model => (
                    <ModelProfileCard key={model.id} model={model} />
                ))}
                {ModelProfiles.data?.length === 0 && <div className="text-text-500">No model profiles found</div>}
            </IconSection>
        </PageCrumbed>
    );
}
