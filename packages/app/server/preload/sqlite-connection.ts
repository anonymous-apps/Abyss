import { SQliteClient } from '@abyss/records';
import os from 'os';
import path from 'path';

const dbPath = path.join(os.homedir(), '.abyss', 'sqlite');

window['abyss-sqlite'] = new SQliteClient(dbPath);
