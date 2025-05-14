import { app, BrowserWindow, ipcMain } from 'electron';
import fs from 'node:fs';
import path, { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AppController } from './app-controller';

// Setup __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const electronSrcPath = dirname(__filename); // Path inside asar in prod

process.env.DIST_ELECTRON = join(electronSrcPath, '../');
const isDev = !!process.env.VITE_DEV_SERVER_URL;
process.env.DIST = isDev ? join(process.env.DIST_ELECTRON, '../dist-vite') : join(app.getAppPath(), '../dist-vite');
process.env.VITE_PUBLIC = isDev ? join(process.env.DIST_ELECTRON, '../public') : join(app.getAppPath(), '../dist-vite'); // Tentative for VITE_PUBLIC

// Compute a safe user data location (e.g. ~/.abyss)
const userDataPath = path.join(process.env.HOME || process.env.USERPROFILE || '', '.abyss');
if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true });
}

// create the app controller
const appController = new AppController();

// Env
const preload = join(electronSrcPath, '../preload/index.mjs');
const devServerUrl = process.env.VITE_DEV_SERVER_URL; // Keep this for clarity

// Create the main application window
async function createWindow() {
    // Calculate production paths here, as app is ready
    const unpackedDistPath = join(app.getAppPath(), '..', 'app.asar.unpacked', 'dist-vite'); // Path to unpacked dir
    const finalIndexHtmlPath = isDev
        ? join(process.env.DIST_ELECTRON!, '../dist-vite', 'index.html')
        : join(unpackedDistPath, 'index.html'); // Use unpacked path

    const window = new BrowserWindow({
        title: 'Abyss',
        icon: join(isDev ? process.env.VITE_PUBLIC! : unpackedDistPath, 'favicon.ico'), // Use unpacked path
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: true,
        },
        width: 1200,
        height: 800,
        frame: false,
        transparent: true,
        backgroundColor: '#00000000',
        titleBarStyle: 'hidden',
        vibrancy: 'fullscreen-ui',
        titleBarOverlay: false,
        movable: true,
        center: true,
        kiosk: false,
        fullscreen: false,
        visualEffectState: 'active', // Ensures the effect is always active
    });

    if (process.env.NODE_ENV === 'development') {
        // window.webContents.openDevTools();
    }

    appController.setMainWindow(window);
    appController.setIpcMain(ipcMain);
    appController.setupAutoUpdaterHandlers();
    appController.setupAppInfoHandlers();
    window.setWindowButtonVisibility(false);

    if (isDev && devServerUrl) {
        window.loadURL(devServerUrl);
    } else {
        window.loadFile(finalIndexHtmlPath);
    }
}

// Ensure single instance of the application
if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
}

app.whenReady().then(async () => {
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
    // Path to unpacked dir for child windows
    const unpackedDistPathForChild = join(app.getAppPath(), '..', 'app.asar.unpacked', 'dist-vite');
    const finalIndexHtmlPathForChild = isDev
        ? join(process.env.DIST_ELECTRON!, '../dist-vite', 'index.html')
        : join(unpackedDistPathForChild, 'index.html'); // Use unpacked path

    const childWindow = new BrowserWindow({
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    if (isDev && devServerUrl) {
        childWindow.loadURL(`${devServerUrl}#${arg}`);
    } else {
        childWindow.loadFile(finalIndexHtmlPathForChild, { hash: arg });
    }
});
