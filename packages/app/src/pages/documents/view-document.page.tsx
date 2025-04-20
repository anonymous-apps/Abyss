import { IconSection, LabelValue, PageCrumbed } from '@abyss/ui-components';
import { FileText } from 'lucide-react';
import React from 'react';
import { useViewDocument } from './view-document.hook';

export function ViewDocumentPage() {
    const { document, breadcrumbs } = useViewDocument();

    return (
        <PageCrumbed title={`Document: ${document.data?.title || ''}`} breadcrumbs={breadcrumbs}>
            <IconSection title="Document Information" icon={FileText}>
                <LabelValue
                    data={{
                        title: document.data?.title || '',
                        type: document.data?.type || '',
                        version: document.data?.version || 0,
                    }}
                />
            </IconSection>

            <IconSection title="Document Content" icon={FileText}>
                <div className="bg-background-100 p-4 rounded-md whitespace-pre-wrap">{document.data?.text || ''}</div>
            </IconSection>
        </PageCrumbed>
    );
}
