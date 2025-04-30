import { Button, IconSection, LabelValue, PageCrumbed } from '@abyss/ui-components';
import { Box, Settings, Trash } from 'lucide-react';
import React from 'react';
import { useModelProfileView } from './view.hook';

export function ModelProfileViewPage() {
    const { modelProfile, handleDelete, handleUpdateData, handleUpdateConfig, breadcrumbs } = useModelProfileView();

    return (
        <PageCrumbed title={`Model Profile: ${modelProfile?.name || ''}`} breadcrumbs={breadcrumbs}>
            <IconSection title="Profile Information" icon={Box} action={<Button variant="secondary" icon={Trash} onClick={handleDelete} />}>
                <LabelValue
                    data={{
                        name: modelProfile?.name || '',
                        description: modelProfile?.description || '',
                        provider: modelProfile?.providerId || '',
                        modelId: modelProfile?.modelId || '',
                    }}
                />
            </IconSection>

            {modelProfile?.data && Object.keys(modelProfile.data).length > 0 && (
                <IconSection title="Configuration" icon={Settings}>
                    <LabelValue data={modelProfile.data as Record<string, any>} />
                </IconSection>
            )}
        </PageCrumbed>
    );
}
