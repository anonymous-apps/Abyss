import { Button, IconSection, PageCrumbed, Tile, TileGrid } from '@abyss/ui-components';
import { Folder, Table, TableIcon } from 'lucide-react';
import React from 'react';
import { useDatabasePage } from './database.hook';

export function ListTablesPage() {
    const { pageTitle, pageBreadcrumbs, userSettings, allTables, openDbFolder, openDbTable } = useDatabasePage();

    return (
        <PageCrumbed title={pageTitle} breadcrumbs={pageBreadcrumbs} loading={allTables === undefined}>
            <IconSection
                title="Database Tables"
                icon={Table}
                subtitle="Abyss uses a local sqlite database to store all data. Explore the tables below."
                action={<Button icon={Folder} variant="secondary" tooltip="Show on disk" onClick={openDbFolder} />}
            >
                {allTables.data && (
                    <TileGrid>
                        {Object.keys(allTables.data || {})
                            .sort((a, b) => a.localeCompare(b))
                            .map(table => (
                                <Tile
                                    key={table}
                                    title={table}
                                    onClick={() => openDbTable(table)}
                                    icon={<TableIcon className="w-4 h-4" />}
                                    footer={`${allTables.data?.[table].rows || 0} records`}
                                >
                                    {allTables.data?.[table].description}
                                </Tile>
                            ))}
                    </TileGrid>
                )}
            </IconSection>
        </PageCrumbed>
    );
}
