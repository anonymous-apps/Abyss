import { describe, expect, test } from 'vitest';
import { buildCleanDB } from '../../sqlite/sqlite-client.mock';

describe('Settings Table Reference', () => {
    test('when we get the default settings, it will return the default settings object', async () => {
        const client = await buildCleanDB();
        // Calling default() gets or creates the settings
        const settings = await client.tables.settings.default();
        expect(settings).toBeDefined();
        expect(settings.id).toEqual('settings::default');
        // Add more specific assertions about default values if necessary
        expect(settings.lastPage).toEqual('/');
        expect(settings.theme).toEqual('');
    });

    test("when we get the default settings it will create the default settings if they don't exist", async () => {
        const client = await buildCleanDB();
        // Calling default() will create them if they don't exist
        const settings = await client.tables.settings.default();
        expect(settings).toBeDefined();
        expect(settings.id).toEqual('settings::default');

        // Verify it was actually created by trying to get it again
        const settingsAgain = await client.tables.settings.default();
        expect(settingsAgain).toEqual(settings);
    });

    test('when we update the default settings, it will update the default settings object', async () => {
        const client = await buildCleanDB();
        await client.tables.settings.default(); // Ensure defaults are created

        const newThemeValue = 'dark';
        const newLastPage = '/new-page';

        // The update method is on the table directly for default settings
        await client.tables.settings.update({
            theme: newThemeValue,
            lastPage: newLastPage,
        });

        const fetchedSettings = await client.tables.settings.default();
        expect(fetchedSettings.theme).toEqual(newThemeValue);
        expect(fetchedSettings.lastPage).toEqual(newLastPage);
    });

    test('when we call ref() it will return a reference to the default settings', async () => {
        const client = await buildCleanDB();
        await client.tables.settings.default(); // Ensure defaults are created

        const ref = client.tables.settings.ref();
        const settings = await ref.get();
        expect(settings).toBeDefined();
        expect(settings.id).toEqual('settings::default');
    });
});
