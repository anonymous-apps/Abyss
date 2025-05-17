import { LabelValue, PageCrumbed } from '@abyss/ui-components';
import { useRecordPage } from './record.hook';

export function ViewTableRecordPage() {
    const { record, breadcrumbs, type } = useRecordPage();
    const { controller, ...data } = record || {};

    return (
        <PageCrumbed title={`SQLite Record: ${record?.id}`} breadcrumbs={breadcrumbs}>
            <LabelValue data={data} />
        </PageCrumbed>
    );
}
