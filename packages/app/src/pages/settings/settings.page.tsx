import { IconSection, PageCrumbed, SelectDropdown } from '@abyss/ui-components';
import { PaintBucket } from 'lucide-react';
import React from 'react';
import { useSettingsPage } from './settings.hook';

export function SettingsPage() {
    const { breadcrumbs, record, onChangeAppTheme } = useSettingsPage();

    return (
        <PageCrumbed title={'Abyss Settings'} breadcrumbs={breadcrumbs} loading={record === undefined}>
            <IconSection icon={PaintBucket} title="App Theme">
                <SelectDropdown
                    className="w-52"
                    selectedId={record?.theme || 'etherial'}
                    onSelect={onChangeAppTheme}
                    options={[
                        { id: 'etherial', label: 'Etherial' },
                        { id: 'abyss', label: 'Abyss' },
                    ]}
                />
            </IconSection>
        </PageCrumbed>
    );
}
