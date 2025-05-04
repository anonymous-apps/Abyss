import { describe, expect, test } from 'vitest';
import { buildCleanDB } from '../../sqlite/sqlite-client.test';

describe('LogStream::create', () => {
    test('Happy: Create logstream record', async () => {
        const client = await buildCleanDB();
        const logstream = await client.tables.logStream.create({
            id: 'logstream::test',
            sourceId: 'source::test',
            status: 'inProgress',
            messagesData: [],
        });
        expect(logstream).toBeDefined();
        expect(logstream.id).toBe('logstream::test');
    });
});
