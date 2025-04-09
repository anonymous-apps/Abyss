import { fork } from 'node:child_process';
import fs, { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { electronDataPath } from '../index';

// Compute a safe user data location (e.g. ~/.abyss)
const userDataPath = path.join(process.env.HOME || process.env.USERPROFILE || '', '.abyss');
if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true });
}

// Define the full path to the SQLite file and convert it to a proper file URL
const dbPath = path.join(userDataPath, 'database.sqlite');
const dbUrl = pathToFileURL(dbPath).href;
process.env.DATABASE_URL = dbUrl;

export async function runMigrations() {
    return new Promise((resolve, reject) => {
        const possibleMigrationScripts = [
            path.join(process.resourcesPath, 'scripts', 'run-migrations.cjs'),
            path.join(electronDataPath, '..', '..', 'scripts', 'run-migrations.cjs'),
        ];

        const migrationScript = possibleMigrationScripts.find(script => existsSync(script));
        console.log('Running migrations from:', migrationScript);

        // Fork the migration script.
        const child = fork(migrationScript!, [], {
            stdio: 'inherit',
            env: {
                ...process.env,
                SKIP_MAIN: 'true',
            },
        });

        child.stdout?.on('data', data => {
            console.log(`Migration stdout: ${data}`);
        });

        child.stderr?.on('data', data => {
            console.error(`Migration stderr: ${data}`);
        });

        child.on('exit', code => {
            if (code === 0) {
                resolve(void 0);
            } else {
                reject(new Error(`Migration process exited with code ${code}`));
            }
        });
    });
}
