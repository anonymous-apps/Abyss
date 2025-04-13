import { Button, IconSection, PageCrumbed } from '@abyss/ui-components';
import { Table, Trash } from 'lucide-react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CustomTable } from '../../library/content/database-table';
import { Database } from '../../main';
import { useDatabaseTableSubscription } from '../../state/database-connection';

export function ViewTablePage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const scanTable = useDatabaseTableSubscription(id as string, async database =>
        database.table[id as keyof typeof database.table].scanTable()
    );

    const breadcrumbs = [
        { name: 'Home', onClick: () => navigate('/') },
        { name: 'Database', onClick: () => navigate('/database') },
        { name: id!, onClick: () => navigate(`/database/id/${id}`) },
    ];

    const onPurgeTable = () => {
        Database.table[id as keyof typeof Database.table].removeAll();
    };

    const content = scanTable.data && (
        <>
            <IconSection
                title={`SQLite Table: ${id}`}
                icon={Table}
                action={<Button variant="secondary" icon={Trash} onClick={onPurgeTable} />}
            >
                <CustomTable table={id as string} records={scanTable.data as Record<string, any>[]} />
            </IconSection>
        </>
    );

    return (
        <PageCrumbed title={`SQLite Table: ${id}`} breadcrumbs={breadcrumbs}>
            {content}
        </PageCrumbed>
    );
}
