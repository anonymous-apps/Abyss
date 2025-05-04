import { describe, expect, test } from 'vitest';
import { buildCleanDB } from '../../sqlite/sqlite-client.test';

describe('MessageThread::create', () => {
    test('Happy: Create message thread record', async () => {
        const client = await buildCleanDB();
        const messageThread = await client.tables.messageThread.create({
            id: 'message-thread::test',
            messagesData: [],
        });
        expect(messageThread).toBeDefined();
        expect(messageThread.id).toBe('message-thread::test');
    });
});
