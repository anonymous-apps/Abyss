/*
  Warnings:

  - Added the required column `owner` to the `ActionDefinitions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ActionDefinitions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "owner" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ActionDefinitions" ("createdAt", "data", "description", "id", "name", "type", "updatedAt") SELECT "createdAt", "data", "description", "id", "name", "type", "updatedAt" FROM "ActionDefinitions";
DROP TABLE "ActionDefinitions";
ALTER TABLE "new_ActionDefinitions" RENAME TO "ActionDefinitions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
