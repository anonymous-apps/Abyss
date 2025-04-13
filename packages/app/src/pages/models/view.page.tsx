import { IconSection, PageCrumbed } from '@abyss/ui-components';
import { Box, Settings, Trash2 } from 'lucide-react';
import React from 'react';
import { DestructiveButton } from '../../library/input/button';
import { EditableLabelValue } from '../../library/input/label-value';
import { useModelProfileView } from './view.hook';

export function ModelProfileViewPage() {
    const { modelProfile, handleDelete, handleUpdateData, handleUpdateConfig, breadcrumbs } = useModelProfileView();

    const content = !modelProfile.data ? (
        <div className="text-text-300">Loading model profile data...</div>
    ) : (
        <>
            <IconSection title="Profile Information" icon={Box}>
                <EditableLabelValue
                    data={{
                        name: modelProfile.data.name,
                        description: modelProfile.data.description,
                        provider: modelProfile.data.provider,
                        modelId: modelProfile.data.modelId,
                    }}
                    editableKeys={['description', 'name', 'provider', 'modelId']}
                    onChange={handleUpdateData}
                />
            </IconSection>

            {modelProfile.data.data && Object.keys(modelProfile.data.data).length > 0 && (
                <IconSection title="Configuration" icon={Settings}>
                    <EditableLabelValue
                        data={modelProfile.data.data as Record<string, any>}
                        editableKeys={Object.keys(modelProfile.data.data)}
                        onChange={handleUpdateConfig}
                    />
                </IconSection>
            )}

            <IconSection title="Danger Zone" icon={Trash2}>
                <DestructiveButton onClick={handleDelete}>Delete Model Profile</DestructiveButton>
            </IconSection>
        </>
    );

    return (
        <PageCrumbed title={`Model Profile: ${modelProfile.data?.name || ''}`} breadcrumbs={breadcrumbs}>
            {content}
        </PageCrumbed>
    );
}
