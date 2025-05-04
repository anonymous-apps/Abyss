import { describe, expect, test } from 'vitest';
import { buildCleanDB } from '../../sqlite/sqlite-client.test';

describe('ChatThread::create', () => {
    test('Happy: Create chat thread record', async () => {
        const client = await buildCleanDB();
        const chatThread = await client.tables.chatThread.create({
            id: 'chat-thread::test',
            name: 'Test Chat Thread',
            description: 'A test chat thread',
            threadId: 'thread::test',
            participantId: 'user::test',
        });
        expect(chatThread).toBeDefined();
        expect(chatThread.id).toBe('chat-thread::test');
    });
});
