import { app, BrowserWindow, ipcMain } from 'electron';
import fs from 'node:fs';
import path, { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AppController } from './app-controller';
import { runMigrations } from './handlers/prisma';

// Setup __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
export const electronDataPath = dirname(__filename);

process.env.DIST_ELECTRON = join(electronDataPath, '../');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist-vite');
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL ? join(process.env.DIST_ELECTRON, '../public') : process.env.DIST;

// Compute a safe user data location (e.g. ~/.abyss)
const userDataPath = path.join(process.env.HOME || process.env.USERPROFILE || '', '.abyss');
if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true });
}

// create the app controller
const appController = new AppController();

// Env
const preload = join(electronDataPath, '../preload/index.mjs');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST!, 'index.html');

// Create the main application window
async function createWindow() {
    const window = new BrowserWindow({
        title: 'Abyss',
        icon: join(process.env.VITE_PUBLIC!, 'favicon.ico'),
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: true,
            webSecurity: true,
        },
        width: 1200,
        height: 800,
        frame: false,
        transparent: true,
        backgroundColor: '#00000000',
        titleBarStyle: 'hidden',
        vibrancy: 'fullscreen-ui',
        movable: true,
        center: true,
        kiosk: false,
        fullscreen: false,
        visualEffectState: 'active', // Ensures the effect is always active
    });

    appController.setMainWindow(window);
    appController.setupAutoUpdater();

    if (url) {
        window.loadURL(url);
    } else {
        window.loadFile(indexHtml);
    }
}

// Ensure single instance of the application
if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
}

app.whenReady().then(async () => {
    try {
        await runMigrations();
    } catch (error) {
        console.error('Migrations failed:', error);
        app.quit();
        return;
    }
    createWindow();
});

app.on('window-all-closed', () => {
    appController.closeMainWindow();
    app.quit();
});

app.on('second-instance', () => {
    const mainWindow = appController.getMainWindow();
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
});

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length) {
        allWindows[0].focus();
    } else {
        createWindow();
    }
});

ipcMain.handle('open-win', (_, arg) => {
    const childWindow = new BrowserWindow({
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        childWindow.loadURL(`${url}#${arg}`);
    } else {
        childWindow.loadFile(indexHtml, { hash: arg });
    }
});
