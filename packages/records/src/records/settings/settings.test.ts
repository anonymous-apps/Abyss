import { describe, expect, test } from 'vitest';
import type { SQliteClient } from '../../sqlite/sqlite-client';
import { buildCleanDB } from '../../sqlite/sqlite-client.mock';

describe('Settings Table Reference', () => {
    let client: SQliteClient;

    describe('when we get the default settings', () => {
        test('it will return the default settings object if it already exists', async () => {
            client = await buildCleanDB();
            // First, create the default settings to ensure they exist
            await client.tables.settings.create({ id: 'settings::default', lastPage: '/initial', theme: 'dark' });
            const settings = await client.tables.settings.default();
            expect(settings.id).toEqual('settings::default');
            expect(settings.lastPage).toEqual('/initial');
            expect(settings.theme).toEqual('dark');
        });

        test("it will create the default settings if they don't exist", async () => {
            client = await buildCleanDB();
            const settings = await client.tables.settings.default();
            expect(settings.id).toEqual('settings::default');
            expect(settings.lastPage).toEqual('/'); // Default value from ReferencedSettingsTable constructor
            expect(settings.theme).toEqual(''); // Default value from ReferencedSettingsTable constructor
        });
    });

    describe('when we update the default settings', () => {
        test('it will update the default settings object if it already exists', async () => {
            client = await buildCleanDB();
            // First, create the default settings to ensure they exist
            await client.tables.settings.create({ id: 'settings::default', lastPage: '/initial', theme: 'light' });
            await client.tables.settings.update({ lastPage: '/updated', theme: 'dark' });
            const updatedSettings = await client.tables.settings.default(); // .default() will retrieve existing after update
            expect(updatedSettings.id).toEqual('settings::default');
            expect(updatedSettings.lastPage).toEqual('/updated');
            expect(updatedSettings.theme).toEqual('dark');
        });

        test("it will create the default settings if they don't exist", async () => {
            client = await buildCleanDB();
            // Attempting to update when no settings exist should create them
            await client.tables.settings.update({ lastPage: '/new-page', theme: 'system' });
            const createdSettings = await client.tables.settings.default(); // .default() will retrieve the newly created settings
            expect(createdSettings.id).toEqual('settings::default');
            expect(createdSettings.lastPage).toEqual('/new-page');
            expect(createdSettings.theme).toEqual('system');
        });
    });

    describe('when we call ref()', () => {
        test('it will return a reference to the default settings', async () => {
            client = await buildCleanDB();
            const settingsRef = client.tables.settings.ref();
            expect(settingsRef.id).toEqual('settings::default');

            // Check it doesn't exist yet in the DB via the reference
            let exists = await settingsRef.exists();
            expect(exists).toBe(false);

            // Create the default settings (e.g., by calling .default())
            await client.tables.settings.default();

            // Now it should exist in the DB
            exists = await settingsRef.exists();
            expect(exists).toBe(true);

            // Get the settings via the reference
            const settings = await settingsRef.get();
            expect(settings.id).toEqual('settings::default');
            expect(settings.lastPage).toEqual('/'); // Default value upon creation
            expect(settings.theme).toEqual(''); // Default value upon creation
        });
    });
});
