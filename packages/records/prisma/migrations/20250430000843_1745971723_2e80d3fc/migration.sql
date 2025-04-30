-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AgentGraph" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "nodes" JSONB NOT NULL,
    "edges" JSONB NOT NULL
);
INSERT INTO "new_AgentGraph" ("createdAt", "description", "edges", "id", "name", "nodes", "updatedAt") SELECT "createdAt", "description", "edges", "id", "name", "nodes", "updatedAt" FROM "AgentGraph";
DROP TABLE "AgentGraph";
ALTER TABLE "new_AgentGraph" RENAME TO "AgentGraph";
CREATE TABLE "new_MessageThread" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "turns" JSONB NOT NULL
);
INSERT INTO "new_MessageThread" ("createdAt", "id", "turns", "updatedAt") SELECT "createdAt", "id", "turns", "updatedAt" FROM "MessageThread";
DROP TABLE "MessageThread";
ALTER TABLE "new_MessageThread" RENAME TO "MessageThread";
CREATE TABLE "new_Metric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "dimensions" JSONB NOT NULL,
    "value" REAL NOT NULL
);
INSERT INTO "new_Metric" ("createdAt", "dimensions", "id", "name", "value") SELECT "createdAt", "dimensions", "id", "name", "value" FROM "Metric";
DROP TABLE "Metric";
ALTER TABLE "new_Metric" RENAME TO "Metric";
CREATE TABLE "new_Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastPage" TEXT NOT NULL,
    "theme" TEXT NOT NULL
);
INSERT INTO "new_Settings" ("createdAt", "id", "lastPage", "theme", "updatedAt") SELECT "createdAt", "id", "lastPage", "theme", "updatedAt" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
CREATE TABLE "new_TextDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "previousId" TEXT,
    "nextId" TEXT
);
INSERT INTO "new_TextDocument" ("content", "createdAt", "id", "nextId", "previousId", "title", "type", "updatedAt") SELECT "content", "createdAt", "id", "nextId", "previousId", "title", "type", "updatedAt" FROM "TextDocument";
DROP TABLE "TextDocument";
ALTER TABLE "new_TextDocument" RENAME TO "TextDocument";
CREATE TABLE "new_agentGraphExecution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'notStarted',
    "startTime" DATETIME NOT NULL DEFAULT '1970-01-01 00:00:00 +00:00',
    "endTime" DATETIME NOT NULL DEFAULT '1970-01-01 00:00:00 +00:00',
    "agentGraphId" TEXT NOT NULL,
    "events" JSONB NOT NULL DEFAULT []
);
INSERT INTO "new_agentGraphExecution" ("agentGraphId", "createdAt", "endTime", "events", "id", "startTime", "status", "updatedAt") SELECT "agentGraphId", "createdAt", "endTime", "events", "id", "startTime", "status", "updatedAt" FROM "agentGraphExecution";
DROP TABLE "agentGraphExecution";
ALTER TABLE "new_agentGraphExecution" RENAME TO "agentGraphExecution";
CREATE TABLE "new_chatThread" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL
);
INSERT INTO "new_chatThread" ("createdAt", "description", "id", "name", "participantId", "threadId", "updatedAt") SELECT "createdAt", "description", "id", "name", "participantId", "threadId", "updatedAt" FROM "chatThread";
DROP TABLE "chatThread";
ALTER TABLE "new_chatThread" RENAME TO "chatThread";
CREATE TABLE "new_modelConnection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "accessFormat" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "data" JSONB NOT NULL
);
INSERT INTO "new_modelConnection" ("accessFormat", "createdAt", "data", "description", "id", "modelId", "name", "providerId", "updatedAt") SELECT "accessFormat", "createdAt", "data", "description", "id", "modelId", "name", "providerId", "updatedAt" FROM "modelConnection";
DROP TABLE "modelConnection";
ALTER TABLE "new_modelConnection" RENAME TO "modelConnection";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
