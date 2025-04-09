import { Table, Trash } from 'lucide-react';
import React from 'react';
import { useParams } from 'react-router-dom';
import { CustomTable } from '../../library/content/database-table';
import { GhostIconButton } from '../../library/input/button';
import { IconSection } from '../../library/layout/icon-section';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { WithSidebar } from '../../library/layout/sidebar';
import { Database } from '../../main';
import { useDatabaseTableSubscription } from '../../state/database-connection';

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
                <CustomTable table={id as string} records={scanTable.data as Record<string, any>[]} />
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
