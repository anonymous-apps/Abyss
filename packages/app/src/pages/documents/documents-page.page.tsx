import { IconSection, PageCrumbed, Tile, TileGrid } from '@abyss/ui-components';
import { FileText } from 'lucide-react';
import React from 'react';
import { useDocumentsPage } from './documents-page.hook';

export function DocumentsPage() {
    const { documents, navigate } = useDocumentsPage();

    return (
        <PageCrumbed
            title="Documents"
            breadcrumbs={[
                { name: 'Home', onClick: () => navigate('/') },
                { name: 'Documents', onClick: () => navigate('/documents') },
            ]}
        >
            <IconSection title="Documents" icon={FileText}>
                {documents.data && documents.data.length > 0 ? (
                    <TileGrid>
                        {documents.data.map(document => (
                            <Tile
                                key={document.id}
                                title={document.title || 'Untitled'}
                                onClick={() => navigate(`/documents/id/${document.id}`)}
                                icon={<FileText className="w-4 h-4" />}
                                footer={`Version: ${document.version} | Type: ${document.type}`}
                            >
                                {document.text.substring(0, 100)}...
                            </Tile>
                        ))}
                    </TileGrid>
                ) : (
                    <div className="text-text-700">No documents found</div>
                )}
            </IconSection>
        </PageCrumbed>
    );
}
