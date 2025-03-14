// preload.js
import { contextBridge, ipcRenderer } from 'electron';
import { execSync } from 'node:child_process';
import './database-connection';
import path from 'node:path';

contextBridge.exposeInMainWorld('updater', {
    // Trigger the update check
    checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),

    // Listen for the "update-available" event
    onUpdateAvailable: callback => {
        ipcRenderer.on('update-available', (event, info) => callback(info));
    },

    onUpdateNotAvailable: callback => {
        ipcRenderer.on('update-not-available', (event, info) => callback(info));
    },

    onUpdaterError: callback => {
        ipcRenderer.on('updator-error', (event, info) => callback(info));
    },

    // Listen for download progress events
    onDownloadProgress: callback => {
        ipcRenderer.on('download-progress', (event, progress) => callback(progress));
    },

    // Listen for when the update has been downloaded
    onUpdateDownloaded: callback => {
        ipcRenderer.on('update-downloaded', (event, info) => callback(info));
    },

    // Trigger the restart to install the update
    restartToUpdate: () => ipcRenderer.invoke('restart-to-update'),
});

contextBridge.exposeInMainWorld('fs', {
    // Open the database folder in the file system
    openDbFolder: () => execSync(`open ${path.dirname(process.env.DATABASE_URL!)}`),

    // Public paths
    assetPath: (asset: string) =>
        process.env.VITE_DEV_SERVER_URL
            ? `${process.env.VITE_DEV_SERVER_URL}/${asset}`
            : path.join(__dirname, '..', '..', 'app.asar.unpacked', 'assets', asset),
});
