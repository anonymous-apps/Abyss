import { RenderedConversationThread } from '@prisma/client';
import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { TableKeyValue } from '../../library/content/database-table';
import { LabelValue } from '../../library/layout/label-value';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { WithSidebar } from '../../library/layout/sidebar';
import { useDatabaseQuery } from '../../state/database-connection';
import { CustomRendererForConversationThread } from './custom/rendered-conversation-thread';

export function ViewTableRecordPage() {
    const { id, recordId } = useParams();
    const path = useLocation();

    const record = useDatabaseQuery(async database => database.table[id as keyof typeof database.table].getByRecordId(recordId as string));

    useEffect(() => {
        record.refetch();
    }, [path.pathname]);

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Database', url: '/database' },
        { name: id!, url: `/database/id/${id}` },
        { name: recordId!, url: `/database/id/${id}/record/${recordId}` },
    ];

    const WrappedContent = ({ children }: { children: React.ReactNode }) => {
        return (
            <WithSidebar>
                <PageCrumbed title={`Record: ${recordId}`} breadcrumbs={breadcrumbs}>
                    {children}
                </PageCrumbed>
            </WithSidebar>
        );
    };

    if (record.loading) {
        return <WrappedContent>Loading record data...</WrappedContent>;
    }

    if (!record.data) {
        return (
            <WrappedContent>
                No record data found for <b>{recordId}</b>, it could be a broken link or the record was deleted.
            </WrappedContent>
        );
    }

    const newDataObject: Record<string, any> = {};
    for (const key of Object.keys(record.data || {})) {
        if (key !== 'data') {
            newDataObject[key] = <TableKeyValue table={id!} value={record.data![key]} column={key} />;
        }
    }

    // Some custom renderers
    if (id === 'renderedConversationThread') {
        delete newDataObject['messages'];
        return (
            <WrappedContent>
                <LabelValue data={newDataObject} />
                <CustomRendererForConversationThread thread={record.data as RenderedConversationThread} />
            </WrappedContent>
        );
    }

    return (
        <WrappedContent>
            <LabelValue data={newDataObject} />
        </WrappedContent>
    );
}
