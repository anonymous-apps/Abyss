import { IconSection, PageCrumbed, Table } from '@abyss/ui-components';
import { List } from 'lucide-react';
import React from 'react';
import { useLogList } from './log-list.hook';

export function LogListPage() {
    const { logs, breadcrumbs, logsTableData, onOpenRecordStr } = useLogList();
    return (
        <PageCrumbed title="Log" breadcrumbs={breadcrumbs}>
            <IconSection title="Log Streams" icon={List}>
                <Table table={'logStream'} data={logsTableData} onRecordClick={recordId => onOpenRecordStr(recordId)} />
            </IconSection>
        </PageCrumbed>
    );
}
