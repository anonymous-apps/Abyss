import { Box, Folder, GhostIcon, Play, Table, TableIcon, Workflow } from 'lucide-react';
import React from 'react';
import { IconSection } from '../../library/layout/icon-section';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { Database } from '../../main';
import { useNavigate } from 'react-router-dom';
import { useDatabaseQuery, useDatabaseTableSubscription } from '../../state/database-connection';
import { GhostIconButton } from '../../library/input/button';
import { WithSidebar } from '../../library/layout/sidebar';
import { TileGrid, Tile } from '../../library/layout/tile-grid';

const pageTitle = 'Local Database Explorer';
const pageBreadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Database', url: '/database' },
];

export function ListTablesPage() {
    const navigate = useNavigate();
    const userSettings = useDatabaseTableSubscription('UserSettings', async database => database.table.userSettings.get());
    const allTables = useDatabaseQuery(async database => database.describeTables());

    const content = allTables.data && (
        <>
            <IconSection
                title="Database Tables"
                icon={Table}
                subtitle="Abyss uses a local sqlite database to store all data. Explore the tables below."
                action={
                    <GhostIconButton
                        icon={Folder}
                        tooltip="Show on disk"
                        //@ts-ignore
                        onClick={() => window.fs.openDbFolder()}
                    />
                }
            >
                <TileGrid>
                    {allTables.data
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(table => (
                            <Tile
                                key={table.name}
                                title={table.name}
                                href={`/database/id/${table.name}`}
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
                action={<GhostIconButton icon={Play} onClick={() => Database.bootstrap.bootstrapping.bootstrapDB()} />}
            >
                Bootstrap Status: {userSettings.data?.bootstrapped ? 'Completed' : 'Not Completed'}
            </IconSection>
        </>
    );

    return (
        <WithSidebar>
            <PageCrumbed title={pageTitle} breadcrumbs={pageBreadcrumbs}>
                {content}
            </PageCrumbed>
        </WithSidebar>
    );
}
