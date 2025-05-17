import { Button, IconSection, PageCrumbed, SelectDropdown } from '@abyss/ui-components';
import { Download, PaintBucket } from 'lucide-react';
import { AppUpdaterStatus } from '../../state/app-updater';
import { useSettingsPage } from './settings.hook';

export function SettingsPage() {
    const { breadcrumbs, record, onChangeAppTheme, updates, version } = useSettingsPage();

    return (
        <PageCrumbed title={'Abyss Settings'} breadcrumbs={breadcrumbs} loading={record === undefined}>
            <IconSection icon={PaintBucket} title="App Theme">
                <SelectDropdown
                    className="w-52"
                    selectedId={record?.theme || 'ethereal'}
                    onSelect={onChangeAppTheme}
                    options={[
                        { id: 'abyss', label: 'Abyss' },
                        { id: 'ethereal', label: 'Ethereal' },
                    ]}
                />
            </IconSection>
            <IconSection icon={Download} title="Update">
                <div className="text-sm text-text-500">
                    <div>Current Version: {version || 'unknown'}</div>
                    {updates.status === AppUpdaterStatus.IDLE && <Button onClick={updates.checkForUpdate}>Check for Updates</Button>}
                    {updates.status === AppUpdaterStatus.CHECKING_FOR_UPDATES && <div>Checking for Updates . . .</div>}
                    {updates.status === AppUpdaterStatus.DOWNLOADING && <div>Downloading Update . . .</div>}
                    {updates.status === AppUpdaterStatus.READY_TO_INSTALL && (
                        <div onClick={updates.restartToUpdate}>
                            Install Update now. App will close, then wait a few moments for it to reopen.
                        </div>
                    )}
                    {updates.status === AppUpdaterStatus.ERROR && <div>Error checking for updates</div>}
                </div>
            </IconSection>
        </PageCrumbed>
    );
}
