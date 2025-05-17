export const BaseSettingsTable = `
    CREATE TABLE IF NOT EXISTS Settings (
        id TEXT PRIMARY KEY,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        lastPage TEXT NOT NULL,
        theme TEXT NOT NULL
    )
`;

export const BaseMessageTable = `
    CREATE TABLE IF NOT EXISTS Message (
        id TEXT PRIMARY KEY,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        type TEXT NOT NULL,
        senderId TEXT NOT NULL,
        payloadData TEXT NOT NULL,
        referencedData TEXT
    )
`;

export const BaseMessageThreadTable = `
    CREATE TABLE IF NOT EXISTS MessageThread (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        participantId TEXT,
        blockerId TEXT,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL, 
        messagesData TEXT NOT NULL
    )
`;

export const BaseMetricTable = `
    CREATE TABLE IF NOT EXISTS Metric (
        id TEXT PRIMARY KEY,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        name TEXT NOT NULL,
        dimensionData TEXT NOT NULL,
        value REAL NOT NULL
    )
`;

export const BaseModelConnectionTable = `
    CREATE TABLE IF NOT EXISTS ModelConnection (
        id TEXT PRIMARY KEY,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        accessFormat TEXT NOT NULL,
        providerId TEXT NOT NULL,
        modelId TEXT NOT NULL,
        connectionData TEXT NOT NULL
    )
`;

export const BaseAgentGraphTable = `
    CREATE TABLE IF NOT EXISTS AgentGraph (
        id TEXT PRIMARY KEY,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        nodesData TEXT NOT NULL,
        edgesData TEXT NOT NULL
    )
`;

export const BaseLogStreamTable = `
    CREATE TABLE IF NOT EXISTS LogStream (
        id TEXT PRIMARY KEY,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        sourceId TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        completedAt INTEGER,
        messagesData TEXT NOT NULL
    )
`;

export const BaseToolDefinitionTable = `
    CREATE TABLE IF NOT EXISTS ToolDefinition (
        id TEXT PRIMARY KEY,
        shortName TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        handlerType TEXT NOT NULL,
        inputSchemaData TEXT NOT NULL,
        outputSchemaData TEXT NOT NULL,
        linkedDocumentData TEXT
    )
`;

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

export const AddChatSnapshotTable = `
    CREATE TABLE IF NOT EXISTS ChatSnapshot (
        id TEXT PRIMARY KEY,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        messagesData TEXT NOT NULL
    )
`;
