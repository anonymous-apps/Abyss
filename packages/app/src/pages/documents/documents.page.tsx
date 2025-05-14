import { IconSection, PageCrumbed, Tile, TileGrid } from '@abyss/ui-components';
import { NotebookText } from 'lucide-react';
import React from 'react';
import { useDocumentsPage } from './documents.hook';

export function DocumentsPage() {
    const { breadcrumbs, documents, systemDocuments, viewDocument } = useDocumentsPage();

    return (
        <PageCrumbed title={'Abyss Documents'} breadcrumbs={breadcrumbs} loading={documents === undefined}>
            <IconSection
                icon={NotebookText}
                title="System Documents"
                subtitle="These documents that were created by Abyss and used to run some internal tools and processes, edit at your own risk"
            >
                <TileGrid>
                    {systemDocuments?.map(document => (
                        <Tile
                            key={document.id}
                            title={document.name}
                            onClick={() => viewDocument(document.id)}
                            icon={<NotebookText className="w-4 h-4" />}
                        >
                            {document.name}
                        </Tile>
                    ))}
                    {systemDocuments?.length === 0 && (
                        <div className="text-text-700 text-sm">
                            No system documents defined currently, this is an odd state as abyss should create these for you.
                        </div>
                    )}
                </TileGrid>
            </IconSection>
        </PageCrumbed>
    );
}
