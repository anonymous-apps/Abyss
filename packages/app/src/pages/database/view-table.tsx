import { Box, Table, TableIcon } from 'lucide-react';
import React from 'react';
import { IconSection } from '../../library/layout/icon-section';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { Database } from '../../main';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDatabaseQuery } from '../../state/database-connection';
import { DatabaseTable } from '../../library/content/database-table';

export function ViewTablePage() {
    const { id } = useParams();

    const naviage = useNavigate();
    const scanTable = useDatabaseQuery(async database => database.table[id as keyof typeof database.table].scanTable());

    return (
        <PageCrumbed
            title={`SQLite Table: ${id}`}
            breadcrumbs={[
                { name: 'Home', url: '/' },
                { name: 'Database', url: '/database' },
                { name: id!, url: `/database/id/${id}` },
            ]}
            fullWidth
        >
            <DatabaseTable table={id as string} records={scanTable.data as Record<string, any>[]} />
        </PageCrumbed>
    );
}
