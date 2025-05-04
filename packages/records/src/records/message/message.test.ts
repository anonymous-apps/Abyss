import { describe, expect, test } from 'vitest';
import { buildCleanDB } from '../../sqlite/sqlite-client.test';

describe('Message::create', () => {
    test('Happy: Create message record', async () => {
        const client = await buildCleanDB();
        const message = await client.tables.message.create({
            id: 'message::test',
            type: 'text',
            senderId: 'user::test',
            payloadData: {
                content: 'Test message content',
            },
        });
        expect(message).toBeDefined();
        expect(message.id).toBe('message::test');
    });
});
