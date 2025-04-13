import { IconSection, PageCrumbed } from '@abyss/ui-components';
import { Hammer } from 'lucide-react';
import React from 'react';
import { EditableLabelValue } from '../../library/input/label-value';
import { useToolViewPage } from './view.hook';

export function ToolViewPage() {
    const { tool, handleDelete, handleChange, breadcrumbs } = useToolViewPage();

    return (
        <PageCrumbed title={`Action: ${tool.data?.name || 'Loading...'}`} breadcrumbs={breadcrumbs}>
            <IconSection title="Tool Information" icon={Hammer}>
                <EditableLabelValue
                    data={{
                        name: tool.data?.name || 'Loading...',
                        description: tool.data?.description || 'Loading...',
                        type: tool.data?.type || 'Loading...',
                        schema: JSON.stringify(tool.data?.schema || {}, null, 2),
                    }}
                    editableKeys={['name']}
                    editableArea={['description', 'schema']}
                    onChange={handleChange}
                />
            </IconSection>
        </PageCrumbed>
    );
}
