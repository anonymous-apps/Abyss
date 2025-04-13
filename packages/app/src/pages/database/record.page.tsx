import { LabelValue, PageCrumbed } from '@abyss/ui-components';
import React from 'react';
import { useRecordPage } from './record.hook';

export function ViewTableRecordPage() {
    const { record, breadcrumbs } = useRecordPage();

    return (
        <PageCrumbed title={`SQLite Record: ${record?.data?.id}`} breadcrumbs={breadcrumbs}>
            <LabelValue data={record?.data || {}} />
        </PageCrumbed>
    );
}
