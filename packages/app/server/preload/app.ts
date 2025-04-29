// preload.js
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('app', {
    getVersion: () => ipcRenderer.invoke('get-app-version'),
});
