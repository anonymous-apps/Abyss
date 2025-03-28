import { Hammer, Trash2 } from 'lucide-react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DestructiveButton } from '../../library/input/button';
import { EditableLabelValue } from '../../library/input/label-value';
import { IconSection } from '../../library/layout/icon-section';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { WithSidebar } from '../../library/layout/sidebar';
import { Database } from '../../main';
import { useTableRecordTool } from '../../state/database-connection';

export function ToolViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const tool = useTableRecordTool(id || '');

    const handleDelete = async () => {
        if (!id) return;
        await Database.table.tool.delete(id);
        navigate('/tools');
    };

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Tools', url: '/tools' },
        { name: id || '', url: `/tools/id/${id}` },
    ];

    const content = !tool.data ? (
        <div className="text-text-base">Loading tool data...</div>
    ) : (
        <>
            <IconSection title="Tool Information" icon={Hammer}>
                <EditableLabelValue
                    data={{
                        name: tool.data.name,
                        description: tool.data.description,
                        type: tool.data.type,
                        schema: JSON.stringify(tool.data.schema, null, 2),
                    }}
                    editableKeys={['name']}
                    editableArea={['description', 'schema']}
                    onChange={data => {
                        const newData = { ...tool.data, ...data };
                        if (data.schema && typeof data.schema === 'string') {
                            newData.schema = JSON.parse(data.schema);
                        }
                        Database.table.tool.update(id || '', newData);
                    }}
                />
            </IconSection>

            <IconSection title="Danger Zone" icon={Trash2}>
                <DestructiveButton onClick={handleDelete}>Delete</DestructiveButton>
            </IconSection>
        </>
    );

    return (
        <WithSidebar>
            <PageCrumbed title={`Action: ${tool.data?.name || 'Loading...'}`} breadcrumbs={breadcrumbs}>
                {content}
            </PageCrumbed>
        </WithSidebar>
    );
}
