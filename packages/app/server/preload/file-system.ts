import { contextBridge } from 'electron';
import { execSync } from 'node:child_process';
import path from 'node:path';

contextBridge.exposeInMainWorld('abyss-fs', {
    // Open the database folder in the file system
    openDbFolder: () => execSync(`open ${path.dirname(process.env.DATABASE_URL!)}`),

    // Public paths
    assetPath: (asset: string) =>
        process.env.VITE_DEV_SERVER_URL
            ? `${process.env.VITE_DEV_SERVER_URL}/${asset}`
            : path.join(__dirname, '..', '..', 'app.asar.unpacked', 'assets', asset),
});
