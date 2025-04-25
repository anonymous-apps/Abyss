/*
  Warnings:

  - Added the required column `shortId` to the `Tool` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tool" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "references" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "shortId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "schema" JSONB NOT NULL,
    "data" JSONB
);
INSERT INTO "new_Tool" ("createdAt", "data", "description", "id", "name", "references", "schema", "type", "updatedAt") SELECT "createdAt", "data", "description", "id", "name", "references", "schema", "type", "updatedAt" FROM "Tool";
DROP TABLE "Tool";
ALTER TABLE "new_Tool" RENAME TO "Tool";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
