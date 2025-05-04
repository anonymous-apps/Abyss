export const BaseSettingsTable = `
    CREATE TABLE IF NOT EXISTS Settings (
        id TEXT PRIMARY KEY,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        lastPage TEXT NOT NULL,
        theme TEXT NOT NULL
    )
`;
