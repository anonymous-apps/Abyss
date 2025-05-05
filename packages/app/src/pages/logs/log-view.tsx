import { IconSection, LogView, PageCrumbed } from '@abyss/ui-components';
import { List } from 'lucide-react';
import React from 'react';
import { useLogView } from './log-view.hook';

export function LogViewPage() {
    const { execution, breadcrumbs } = useLogView();
    return (
        <PageCrumbed title="Log Stream" breadcrumbs={breadcrumbs}>
            <IconSection title="Log Stream" icon={List}>
                <LogView logs={execution?.messagesData || []} startTime={execution?.createdAt || 0} />
            </IconSection>
        </PageCrumbed>
    );
}
