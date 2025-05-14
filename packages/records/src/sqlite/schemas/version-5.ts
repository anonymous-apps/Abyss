export const AddDocumentVersionTable = `
    CREATE TABLE IF NOT EXISTS Document (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        name TEXT NOT NULL,
        documentContentData TEXT NOT NULL,
        lastVersionId TEXT,
        nextVersionId TEXT
    )
`;

export const AddToolDefinitionLinkedDocumentData = `
    ALTER TABLE ToolDefinition ADD COLUMN linkedDocumentData TEXT;
`;

export const AddChatSnapshotTable = `
    CREATE TABLE IF NOT EXISTS ChatSnapshot (
        id TEXT PRIMARY KEY,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        messagesData TEXT NOT NULL
    )
`;
