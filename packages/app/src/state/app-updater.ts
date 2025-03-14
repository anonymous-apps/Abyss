import { create } from 'zustand';
import React, { useEffect, useState } from 'react';

export enum AppUpdaterStatus {
    IDLE = 'idle',
    CHECKING_FOR_UPDATES = 'checking-for-updates',
    DOWNLOADING = 'downloading',
    READY_TO_INSTALL = 'ready-to-install',
    ERROR = 'error',
}

interface AppUpdaterState {
    status: AppUpdaterStatus;
    progress: number;
    setStatus: (status: AppUpdaterStatus) => void;
    setProgress: (progress: number) => void;
}

const useAppUpdaterState = create<AppUpdaterState>(set => ({
    status: AppUpdaterStatus.IDLE,
    progress: 0,
    setStatus: status => set({ status }),
    setProgress: progress => set({ progress }),
}));

export const useAppUpdator = () => {
    const state = useAppUpdaterState();

    useEffect(() => {
        //@ts-ignore
        window.updater.onUpdateAvailable(info => {
            console.log('Update available:', info);
            state.setStatus(AppUpdaterStatus.DOWNLOADING);
        });
        //@ts-ignore
        window.updater.onDownloadProgress(progress => {
            console.log('Download progress:', progress);
            state.setProgress(progress.percent || 0);
        });
        //@ts-ignore
        window.updater.onUpdateDownloaded(info => {
            console.log('Update downloaded:', info);
            state.setStatus(AppUpdaterStatus.READY_TO_INSTALL);
        });
        //@ts-ignore
        window.updater.onUpdateNotAvailable(info => {
            state.setStatus(AppUpdaterStatus.IDLE);
        });
        //@ts-ignore
        window.updater.onUpdaterError(info => {
            console.log('Updater error:', info);
            state.setStatus(AppUpdaterStatus.ERROR);
        });
    }, []);

    return {
        status: state.status,
        progress: state.progress,
        checkForUpdate: async () => {
            state.setStatus(AppUpdaterStatus.CHECKING_FOR_UPDATES);
            //@ts-ignore
            const result = await window.updater.checkForUpdates();
            console.log('Check for updates result:', result);
            if (!result) {
                state.setStatus(AppUpdaterStatus.ERROR);
            }
        },
        restartToUpdate: () => {
            //@ts-ignore
            window.updater.restartToUpdate();
        },
    };
};
