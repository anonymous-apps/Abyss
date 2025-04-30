import { PrismaConnection } from '@abyss/records';
import os from 'os';
import path from 'path';

const dbPath = path.join(os.homedir(), '.abyss', 'database.sqlite');

window['abyss-sqlite'] = new PrismaConnection({
    url: dbPath,
});
