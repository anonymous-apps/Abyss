import { Box, Table, TableIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import { IconSection } from '../../library/layout/icon-section';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { Database } from '../../main';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDatabaseQuery } from '../../state/database-connection';
import { DatabaseTable, TableKeyValue } from '../../library/content/database-table';
import { LabelValue } from '../../library/layout/label-value';
import { CustomRendererForConversationThread } from './custom/rendered-conversation-thread';
import { RenderedConversationThread } from '@prisma/client';
import { WithSidebar } from '../../library/layout/sidebar';

export function ViewTableRecordPage() {
    const { id, recordId } = useParams();
    const path = useLocation();
    const navigate = useNavigate();

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

    const content = !record.data ? (
        <div className="text-text-base">Loading record data...</div>
    ) : (
        (() => {
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
                    <>
                        <LabelValue data={newDataObject} />
                        <CustomRendererForConversationThread thread={record.data as RenderedConversationThread} />
                    </>
                );
            }

            return <LabelValue data={newDataObject} />;
        })()
    );

    return (
        <WithSidebar>
            <PageCrumbed title={`Record: ${recordId}`} breadcrumbs={breadcrumbs}>
                {content}
            </PageCrumbed>
        </WithSidebar>
    );
}
