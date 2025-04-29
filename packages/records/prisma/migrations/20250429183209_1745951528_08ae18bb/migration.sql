-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_agentGraphExecution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'notStarted',
    "startTime" DATETIME NOT NULL DEFAULT '1970-01-01 00:00:00 +00:00',
    "endTime" DATETIME NOT NULL DEFAULT '1970-01-01 00:00:00 +00:00',
    "agentGraphId" TEXT NOT NULL,
    "events" JSONB NOT NULL DEFAULT []
);
INSERT INTO "new_agentGraphExecution" ("agentGraphId", "createdAt", "endTime", "events", "id", "startTime", "status", "updatedAt") SELECT "agentGraphId", "createdAt", "endTime", "events", "id", "startTime", "status", "updatedAt" FROM "agentGraphExecution";
DROP TABLE "agentGraphExecution";
ALTER TABLE "new_agentGraphExecution" RENAME TO "agentGraphExecution";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
