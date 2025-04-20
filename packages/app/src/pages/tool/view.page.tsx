import { Button, IconSection, LabelValue, PageCrumbed } from '@abyss/ui-components';
import { Hammer, Trash } from 'lucide-react';
import React from 'react';
import { useToolViewPage } from './view.hook';

export function ToolViewPage() {
    const { tool, handleDelete, handleChange, breadcrumbs } = useToolViewPage();

    return (
        <PageCrumbed title={`Action: ${tool.data?.name || ''}`} breadcrumbs={breadcrumbs}>
            <IconSection title="Tool Information" icon={Hammer} action={<Button variant="secondary" icon={Trash} onClick={handleDelete} />}>
                <LabelValue
                    data={{
                        name: tool.data?.name || '',
                        description: tool.data?.description || '',
                        type: tool.data?.type || '',
                        schema: JSON.stringify(tool.data?.schema || {}, null, 2),
                    }}
                />
            </IconSection>
        </PageCrumbed>
    );
}
