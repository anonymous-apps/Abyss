import { app, BrowserWindow, IpcMain, IpcMainInvokeEvent } from 'electron';
import { setupAutoUpdater } from './handlers/auto-update';
export class AppController {
    private mainWindow: BrowserWindow | null;
    private ipcMain: IpcMain | null;

    constructor() {
        this.mainWindow = null;
        this.ipcMain = null;
    }

    public setMainWindow(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    public setIpcMain(ipcMain: IpcMain) {
        this.ipcMain = ipcMain;
    }

    public getMainWindow() {
        return this.mainWindow;
    }

    public closeMainWindow() {
        this.mainWindow = null;
    }

    public getIpcMain() {
        return this.ipcMain;
    }

    public addIpcHandler(channel: string, handler: (event: IpcMainInvokeEvent, ...args: any[]) => void) {
        this.ipcMain?.handle(channel, handler);
    }

    public setupAutoUpdaterHandlers() {
        setupAutoUpdater(this);
    }

    public setupAppInfoHandlers() {
        this.addIpcHandler('get-app-version', () => app.getVersion());
    }
}
