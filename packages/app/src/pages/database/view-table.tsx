import { Box, Table, TableIcon } from 'lucide-react';
import React from 'react';
import { IconSection } from '../../library/layout/icon-section';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { Database } from '../../main';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDatabaseQuery } from '../../state/database-connection';
import { DatabaseTable } from '../../library/content/database-table';
import { WithSidebar } from '../../library/layout/sidebar';

export function ViewTablePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const scanTable = useDatabaseQuery(async database => database.table[id as keyof typeof database.table].scanTable());

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Database', url: '/database' },
        { name: id!, url: `/database/id/${id}` },
    ];

    if (!scanTable.data) {
        return <PageCrumbed title={`SQLite Table: ${id}`} breadcrumbs={breadcrumbs} />;
    }

    return (
        <WithSidebar>
            <PageCrumbed title={`SQLite Table: ${id}`} breadcrumbs={breadcrumbs}>
                <DatabaseTable table={id as string} records={scanTable.data as Record<string, any>[]} />
            </PageCrumbed>
        </WithSidebar>
    );
}
