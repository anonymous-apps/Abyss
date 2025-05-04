import { Migration } from './type';
import * as version1 from './version-1';

export const migrations: Migration[] = [
    {
        from: 'NONE',
        to: '0.0.1',
        queries: Object.values(version1),
    },
];
