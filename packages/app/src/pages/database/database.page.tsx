import { Button, IconSection, PageCrumbed, Tile, TileGrid } from '@abyss/ui-components';
import { Folder, Play, Table, TableIcon, Workflow } from 'lucide-react';
import React from 'react';
import { useDatabasePage } from './database.hook';

export function ListTablesPage() {
    const { pageTitle, pageBreadcrumbs, userSettings, allTables, openDbFolder, bootstrapDB, openDbTable } = useDatabasePage();

    return (
        <PageCrumbed title={pageTitle} breadcrumbs={pageBreadcrumbs} loading={allTables === undefined}>
            <IconSection
                title="Database Tables"
                icon={Table}
                subtitle="Abyss uses a local sqlite database to store all data. Explore the tables below."
                action={<Button icon={Folder} variant="secondary" tooltip="Show on disk" onClick={openDbFolder} />}
            >
                <TileGrid>
                    {(allTables || [])
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(table => (
                            <Tile
                                key={table.name}
                                title={table.name}
                                onClick={() => openDbTable(table.name)}
                                icon={<TableIcon className="w-4 h-4" />}
                                footer={`${table.recordCount} records`}
                            >
                                {table.description}
                            </Tile>
                        ))}
                </TileGrid>
            </IconSection>

            <IconSection
                title="Database Bootstapping"
                icon={Workflow}
                subtitle="Bootstrapping the database will create the a handful of records that are useful or otherwise required to use Abyss. This is done automatically when you first open the application, but you can re-run this process at any time. Doing so will re-create these records, possibly leading to duplicate data."
                action={<Button tooltip="Bootstrap the database" variant="secondary" icon={Play} onClick={bootstrapDB} />}
            >
                Bootstrap Status: {userSettings.data?.bootstrapped ? 'Completed' : 'Not Completed'}
            </IconSection>
        </PageCrumbed>
    );
}
