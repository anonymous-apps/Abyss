import { IconSection, LabelValue, PageCrumbed } from '@abyss/ui-components';
import { Box, Settings } from 'lucide-react';
import React from 'react';
import { useModelProfileView } from './view.hook';

export function ModelProfileViewPage() {
    const { modelProfile, handleDelete, handleUpdateData, handleUpdateConfig, breadcrumbs } = useModelProfileView();

    const content = !modelProfile.data ? (
        <div className="text-text-300">Loading model profile data...</div>
    ) : (
        <>
            <IconSection title="Profile Information" icon={Box}>
                <LabelValue
                    data={{
                        name: modelProfile.data.name,
                        description: modelProfile.data.description,
                        provider: modelProfile.data.provider,
                        modelId: modelProfile.data.modelId,
                    }}
                />
            </IconSection>

            {modelProfile.data.data && Object.keys(modelProfile.data.data).length > 0 && (
                <IconSection title="Configuration" icon={Settings}>
                    <LabelValue data={modelProfile.data.data as Record<string, any>} />
                </IconSection>
            )}
        </>
    );

    return (
        <PageCrumbed title={`Model Profile: ${modelProfile.data?.name || ''}`} breadcrumbs={breadcrumbs}>
            {content}
        </PageCrumbed>
    );
}
