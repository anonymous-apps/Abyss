import { LabelValue, PageCrumbed } from '@abyss/ui-components';
import { RenderedConversationThread } from '@prisma/client';
import React from 'react';
import { CustomRendererForConversationThread } from './custom/rendered-conversation-thread';
import { useRecordPage } from './record.hook';

export function ViewTableRecordPage() {
    const { record, breadcrumbs, type } = useRecordPage();

    if (type === 'renderedConversationThread') {
        return (
            <PageCrumbed title={`SQLite Record: ${record?.data?.id}`} breadcrumbs={breadcrumbs}>
                <CustomRendererForConversationThread thread={record?.data as RenderedConversationThread} />
            </PageCrumbed>
        );
    }

    return (
        <PageCrumbed title={`SQLite Record: ${record?.data?.id}`} breadcrumbs={breadcrumbs}>
            <LabelValue data={record?.data || {}} />
        </PageCrumbed>
    );
}
