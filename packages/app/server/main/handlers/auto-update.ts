import { autoUpdater } from 'electron-updater';
import { AppController } from '../app-controller';

export function setupAutoUpdater(controller: AppController) {
    autoUpdater.setFeedURL({
        provider: 'github',
        owner: 'abyss-mcp',
        repo: 'Abyss',
        private: false,
    });

    // Forward autoUpdater events to the renderer via IPC
    autoUpdater.on('update-available', info => {
        console.log('Update available:', info);
        const mainWindow = controller.getMainWindow();
        if (mainWindow) {
            mainWindow.webContents.send('update-available', info);
        }
    });

    autoUpdater.on('download-progress', progress => {
        console.log('Download progress:', progress);
        const mainWindow = controller.getMainWindow();
        if (mainWindow) {
            mainWindow.webContents.send('download-progress', progress);
        }
    });

    autoUpdater.on('update-downloaded', info => {
        console.log('Update downloaded:', info);
        const mainWindow = controller.getMainWindow();
        if (mainWindow) {
            mainWindow.webContents.send('update-downloaded', info);
        }
    });

    autoUpdater.on('update-not-available', info => {
        const mainWindow = controller.getMainWindow();
        if (mainWindow) {
            mainWindow.webContents.send('update-not-available', info);
        }
    });

    autoUpdater.on('error', info => {
        const mainWindow = controller.getMainWindow();
        if (mainWindow) {
            mainWindow.webContents.send('updator-error', info);
        }
    });

    autoUpdater.on('update-cancelled', info => {
        const mainWindow = controller.getMainWindow();
        if (mainWindow) {
            mainWindow.webContents.send('updator-error', info);
        }
    });

    controller.addIpcHandler('check-for-updates', async () => {
        const data = await autoUpdater.checkForUpdates();
        return data?.updateInfo;
    });

    controller.addIpcHandler('restart-to-update', () => {
        autoUpdater.quitAndInstall();
    });
}
