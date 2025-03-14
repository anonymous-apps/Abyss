import { Box, Download, Link, PaintBucket, Plus, RefreshCcw } from 'lucide-react';
import React from 'react';
import { Button, GhostIconButton } from '../../library/input/button';
import { IconSection } from '../../library/layout/icon-section';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { useDatabaseTableSubscription } from '../../state/database-connection';
import { Select } from '../../library/input/select';
import { Database } from '../../main';
import { AppUpdaterStatus, useAppUpdator } from '../../state/app-updater';
import { WithSidebar } from '../../library/layout/sidebar';

const pageTitle = 'Abyss Settings';
const pageBreadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Settings', url: '/settings' },
];

const updateerMessage = (status: AppUpdaterStatus, progress: number) => {
    switch (status) {
        case AppUpdaterStatus.IDLE:
            return 'No updates available';
        case AppUpdaterStatus.DOWNLOADING:
            return `Downloading updates... ${Math.round(progress)}%`;
        case AppUpdaterStatus.READY_TO_INSTALL:
            return 'Updates downloaded. Click below to restart to update. App will close and reopen automatically.';
        case AppUpdaterStatus.ERROR:
            return 'Error downloading updates';
    }
};

export function SettingsPage() {
    const updater = useAppUpdator();
    const settings = useDatabaseTableSubscription('UserSettings', database => database.table.userSettings.get());

    const onChangeAppTheme = (theme: string) => {
        Database.table.userSettings.update({ theme });
    };

    const content = settings.data && (
        <>
            <IconSection icon={PaintBucket} title="App Theme">
                <Select value={settings.data.theme || 'abyss'} onChange={onChangeAppTheme} options={[{ value: 'abyss', label: 'Abyss' }]} />
            </IconSection>

            <IconSection
                icon={Download}
                title="App Updates"
                action={<GhostIconButton icon={RefreshCcw} onClick={() => updater.checkForUpdate()} />}
            >
                <div className="flex flex-col gap-2">
                    <a
                        href="https://github.com/abyss-mcp/Abyss"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block gap-2 flex flex-row items-center hover:underline"
                    >
                        Tracking updates from GitHub <Link className="inline-block" size={16} />
                    </a>
                    <div className="flex flex-row gap-2">
                        <div className="text-text-base">{updateerMessage(updater.status, updater.progress)}</div>
                        {updater.status === AppUpdaterStatus.READY_TO_INSTALL && (
                            <Button onClick={() => updater.restartToUpdate()}>Restart to update</Button>
                        )}
                    </div>
                </div>
            </IconSection>
        </>
    );

    return (
        <WithSidebar>
            <PageCrumbed title={pageTitle} breadcrumbs={pageBreadcrumbs}>
                {content}
            </PageCrumbed>
        </WithSidebar>
    );
}
