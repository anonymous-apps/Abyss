import { describe, expect, test } from 'vitest';
import { buildCleanDB } from '../../sqlite/sqlite-client.test';

describe('Settings::default', () => {
    test('Happy: Create default settings record', async () => {
        const client = await buildCleanDB();
        const settings = await client.tables.settings.default();
        expect(settings).toBeDefined();
        expect(settings!.id).toBe('settings::default');
    });
});
