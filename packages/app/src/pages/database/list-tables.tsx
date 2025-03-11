import { Box, Folder, GhostIcon, Table, TableIcon } from 'lucide-react';
import React from 'react';
import { IconSection } from '../../library/layout/icon-section';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { Database } from '../../main';
import { useNavigate } from 'react-router-dom';
import { useDatabaseQuery } from '../../state/database-connection';
import { GhostIconButton } from '../../library/input/button';
import { WithSidebar } from '../../library/layout/sidebar';

const pageTitle = 'Local Database Explorer';
const pageBreadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Database', url: '/database' },
];

export function ListTablesPage() {
    const navigate = useNavigate();
    const allTables = useDatabaseQuery(async database => database.describeTables());

    if (allTables.loading || !allTables.data) {
        return (
            <PageCrumbed title={pageTitle} breadcrumbs={pageBreadcrumbs}>
                {/* Empty content while loading */}
            </PageCrumbed>
        );
    }

    const sorted = allTables.data.sort((a, b) => a.name.localeCompare(b.name));

    return (
        <WithSidebar>
            <PageCrumbed title={pageTitle} breadcrumbs={pageBreadcrumbs}>
                <IconSection
                    title="Database Tables"
                    icon={Table}
                    subtitle="Abyss uses a local sqlite database to store all data. Explore the tables below."
                    action={
                        <GhostIconButton
                            icon={Folder}
                            //@ts-ignore
                            onClick={() => window.fs.openDbFolder()}
                        />
                    }
                >
                    {sorted.map(table => (
                        <div
                            key={table.name}
                            className="text-text-base hover:text-primary-base cursor-pointer flex flex-row gap-3 items-center justify-between max-w-md capitalize"
                            onClick={() => navigate(`/database/id/${table.name}`)}
                        >
                            {table.name}
                            <div className="opacity-50 text-xs">table with {table.recordCount} records</div>
                        </div>
                    ))}
                </IconSection>
            </PageCrumbed>
        </WithSidebar>
    );
}
