import { SQliteClient } from '@abyss/records';
import os from 'os';
import path from 'path';

const dbPath = path.join(os.homedir(), '.abyss', 'sqlite');
export const db = new SQliteClient(dbPath);
window['abyss-sqlite'] = db;
