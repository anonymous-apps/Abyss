import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { IconSection } from '../../library/layout/icon-section';
import { Box, Globe, Settings, Trash2 } from 'lucide-react';
import { Button, DestructiveButton } from '../../library/input/button';
import { Database } from '../../main';
import { useDatabaseTableSubscription } from '../../state/database-connection';
import { LabelValue } from '../../library/layout/label-value';
import { WithSidebar } from '../../library/layout/sidebar';

export function ModelProfileViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const modelProfile = useDatabaseTableSubscription('ModelProfiles', async database => {
        if (!id) return null;
        return database.table.modelConnections.findUnique(id);
    });

    const handleDelete = async () => {
        if (!id) return;
        await Database.table.modelConnections.delete(id);
        navigate('/model-connection');
    };

    if (!modelProfile.data) {
        return null;
    }

    return (
        <WithSidebar>
            <PageCrumbed
                title={`Model Profile: ${modelProfile.data.name}`}
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Models', url: '/model-connection' },
                    { name: modelProfile.data.id, url: `/model-connection/id/${id}` },
                ]}
            >
                <IconSection title="Profile Information" icon={Box}>
                    <LabelValue
                        data={{
                            Name: modelProfile.data.name,
                            Provider: modelProfile.data.provider,
                            Model: modelProfile.data.modelId,
                            'Record Id': modelProfile.data.id,
                        }}
                    />
                </IconSection>

                {modelProfile.data.data && Object.keys(modelProfile.data.data).length > 0 && (
                    <IconSection title="Configuration" icon={Settings}>
                        <LabelValue data={modelProfile.data.data as Record<string, any>} />
                    </IconSection>
                )}

                <IconSection title="Danger Zone" icon={Trash2}>
                    <DestructiveButton onClick={handleDelete}>Delete Model Profile</DestructiveButton>
                </IconSection>
            </PageCrumbed>
        </WithSidebar>
    );
}
