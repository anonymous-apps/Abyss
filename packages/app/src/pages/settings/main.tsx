import { PageCrumbed } from '@abyss/ui-components';
import { PaintBucket } from 'lucide-react';
import React from 'react';
import { Select } from '../../library/input/select';
import { IconSection } from '../../library/layout/icon-section';
import { useSettingsPage } from './main.hook';

export function SettingsPage() {
    const { breadcrumbs, record, onChangeAppTheme } = useSettingsPage();

    return (
        <PageCrumbed title={'Abyss Settings'} breadcrumbs={breadcrumbs} loading={record === undefined}>
            <IconSection icon={PaintBucket} title="App Theme">
                <Select
                    value={record?.theme || 'etherial'}
                    onChange={onChangeAppTheme}
                    options={[
                        { value: 'etherial', label: 'Etherial' },
                        { value: 'abyss', label: 'Abyss' },
                    ]}
                />
            </IconSection>
        </PageCrumbed>
    );
}
