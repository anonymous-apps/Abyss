import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('abyss-updater', {
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
