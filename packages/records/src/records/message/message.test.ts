import { describe, expect, test } from 'vitest';
import { buildCleanDB } from '../../sqlite/sqlite-client.mock';

describe('Message Table', () => {
    test('we can get a message referance by id', async () => {
        const client = await buildCleanDB();
        const message = await client.tables.message.create({
            type: 'text',
            senderId: 'user1',
            payloadData: { content: 'Hello' },
        });
        const ref = client.tables.message.ref(message.id);
        const result = await ref.get();
        expect(result.id).toEqual(message.id);
    });
});
