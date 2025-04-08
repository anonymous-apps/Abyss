import { Box, Settings, Trash2 } from 'lucide-react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DestructiveButton } from '../../library/input/button';
import { EditableLabelValue } from '../../library/input/label-value';
import { IconSection } from '../../library/layout/icon-section';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { WithSidebar } from '../../library/layout/sidebar';
import { Database } from '../../main';
import { useTableRecordModelConnections } from '../../state/database-connection';

export function ModelProfileViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const modelProfile = useTableRecordModelConnections(id || '');
    const handleDelete = async () => {
        if (!id) return;
        await Database.table.modelConnections.delete(id);
        navigate('/models');
    };

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Models', url: '/models' },
        { name: id || '', url: `/models/id/${id}` },
    ];

    const content = !modelProfile.data ? (
        <div className="text-text-base">Loading model profile data...</div>
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
                    onChange={data => {
                        const newData = { ...modelProfile.data, ...data };
                        Database.table.modelConnections.update(id || '', newData);
                    }}
                />
            </IconSection>

            {modelProfile.data.data && Object.keys(modelProfile.data.data).length > 0 && (
                <IconSection title="Configuration" icon={Settings}>
                    <EditableLabelValue
                        data={modelProfile.data.data as Record<string, any>}
                        editableKeys={Object.keys(modelProfile.data.data)}
                        onChange={data => {
                            const newData = { ...modelProfile.data, data };
                            Database.table.modelConnections.update(id || '', newData);
                        }}
                    />
                </IconSection>
            )}

            <IconSection title="Danger Zone" icon={Trash2}>
                <DestructiveButton onClick={handleDelete}>Delete Model Profile</DestructiveButton>
            </IconSection>
        </>
    );

    return (
        <WithSidebar>
            <PageCrumbed title={`Model Profile: ${modelProfile.data?.name || 'Loading...'}`} breadcrumbs={breadcrumbs}>
                {content}
            </PageCrumbed>
        </WithSidebar>
    );
}
