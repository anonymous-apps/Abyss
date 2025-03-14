import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { IconSection } from '../../library/layout/icon-section';
import { Box, Hammer, Settings, Trash2, Code } from 'lucide-react';
import { Button, DestructiveButton } from '../../library/input/button';
import { Database } from '../../main';
import { useDatabaseTableSubscription } from '../../state/database-connection';
import { LabelValue } from '../../library/layout/label-value';
import { WithSidebar } from '../../library/layout/sidebar';

export function ActionViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const action = useDatabaseTableSubscription('ActionDefinitions', async database => {
        if (!id) return null;
        return database.table.actionDefinitions.findUnique(id);
    });

    const handleDelete = async () => {
        if (!id) return;
        await Database.table.actionDefinitions.delete(id);
        navigate('/actions');
    };

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Actions', url: '/actions' },
        { name: id || '', url: `/actions/id/${id}` },
    ];

    const config = action.data;

    const content = !action.data ? (
        <div className="text-text-base">Loading action data...</div>
    ) : (
        <>
            <IconSection title="Action Information" icon={Hammer}>
                <LabelValue
                    data={{
                        Name: action.data.name,
                        Type: action.data.type,
                        Description: action.data.description,
                        Owner: action.data.owner,
                        'Record Id': action.data.id,
                    }}
                />
            </IconSection>

            {action.data.owner === 'USER' && (
                <IconSection title="Danger Zone" icon={Trash2}>
                    <DestructiveButton onClick={handleDelete}>Delete Action</DestructiveButton>
                </IconSection>
            )}

            {action.data.owner === 'SYSTEM' && (
                <div className="text-text-base">This action is provided by the system and cannot be modified.</div>
            )}
        </>
    );

    return (
        <WithSidebar>
            <PageCrumbed title={`Action: ${action.data?.name || 'Loading...'}`} breadcrumbs={breadcrumbs}>
                {content}
            </PageCrumbed>
        </WithSidebar>
    );
}
