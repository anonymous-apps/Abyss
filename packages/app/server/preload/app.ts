// preload.js
import { ipcRenderer } from 'electron';

window['abyss-app'] = {
    getVersion: () => ipcRenderer.invoke('get-app-version'),
};
