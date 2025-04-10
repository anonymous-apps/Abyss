import fs from 'node:fs';
import path from 'node:path';

const userDataPath = path.join(process.env.HOME || process.env.USERPROFILE || '', '.abyss');
if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true });
}

// Define the full path to the SQLite file and convert it to a proper file URL
const dbPath = path.join(userDataPath, 'database.sqlite');

export async function CalculateSqliteSize() {
    const size = await fs.promises.stat(dbPath);
    return size.size;
}
