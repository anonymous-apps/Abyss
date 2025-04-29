// preload.js
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('abyss-app', {
    getVersion: () => ipcRenderer.invoke('get-app-version'),
});
