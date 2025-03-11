import { Box, Table, TableIcon, Trash } from 'lucide-react';
import React from 'react';
import { IconSection } from '../../library/layout/icon-section';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { Database } from '../../main';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDatabaseQuery, useDatabaseRecordSubscription, useDatabaseTableSubscription } from '../../state/database-connection';
import { DatabaseTable } from '../../library/content/database-table';
import { WithSidebar } from '../../library/layout/sidebar';
import { GhostIconButton } from '../../library/input/button';

export function ViewTablePage() {
    const { id } = useParams();

    const scanTable = useDatabaseTableSubscription(id as string, async database =>
        database.table[id as keyof typeof database.table].scanTable()
    );

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Database', url: '/database' },
        { name: id!, url: `/database/id/${id}` },
    ];

    const onPurgeTable = () => {
        Database.table[id as keyof typeof Database.table].removeAll();
    };

    const content = scanTable.data && (
        <>
            <IconSection
                title={`SQLite Table: ${id}`}
                icon={Table}
                action={<GhostIconButton icon={Trash} onClick={onPurgeTable} label="Purge Table" />}
            >
                <DatabaseTable table={id as string} records={scanTable.data as Record<string, any>[]} onPurgeTable={onPurgeTable} />
            </IconSection>
        </>
    );

    return (
        <WithSidebar>
            <PageCrumbed title={`SQLite Table: ${id}`} breadcrumbs={breadcrumbs}>
                {content}
            </PageCrumbed>
        </WithSidebar>
    );
}
