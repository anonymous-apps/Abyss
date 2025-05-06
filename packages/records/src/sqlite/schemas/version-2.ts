export const BaseToolDefinitionTable = `
    CREATE TABLE IF NOT EXISTS ToolDefinition (
        id TEXT PRIMARY KEY,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        handlerType TEXT NOT NULL,
        inputSchemaData TEXT NOT NULL,
        outputSchemaData TEXT NOT NULL
    )
`;
