import { Migration } from './type';
import * as version1 from './version-1';
import * as version2 from './version-2';
import * as version3 from './version-3';
import * as version4 from './version-4';
import * as version5 from './version-5';

export const migrations: Migration[] = [
    {
        from: 'NONE',
        to: '0.0.1',
        queries: Object.values(version1),
    },
    {
        from: '0.0.1',
        to: '0.0.2',
        queries: Object.values(version2),
    },
    {
        from: '0.0.2',
        to: '0.0.3',
        queries: Object.values(version3),
    },
    {
        from: '0.0.3',
        to: '0.0.4',
        queries: Object.values(version4),
    },
    {
        from: '0.0.4',
        to: '0.0.5',
        queries: Object.values(version5),
    },
];
