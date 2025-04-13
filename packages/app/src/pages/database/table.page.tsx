import { Button, IconSection, PageCrumbed, Table } from '@abyss/ui-components';
import { TableIcon, Trash } from 'lucide-react';
import React from 'react';
import { useTable } from './table.hook';

export function ViewTablePage() {
    const { table, breadcrumbs, onPurgeTable, scanTable, onOpenRecordStr } = useTable();

    return (
        <PageCrumbed title={`SQLite Table: ${table}`} breadcrumbs={breadcrumbs}>
            <IconSection
                title={`SQLite Table: ${table}`}
                icon={TableIcon}
                action={<Button tooltip="Purge Table" variant="secondary" icon={Trash} onClick={onPurgeTable} />}
            >
                <Table
                    table={table}
                    data={scanTable.data as Record<string, any>[]}
                    ignoreColumns={['createdAt', 'updatedAt']}
                    onRowClick={record => onOpenRecordStr(record.id)}
                    onRecordClick={record => onOpenRecordStr(record)}
                />
            </IconSection>
        </PageCrumbed>
    );
}
