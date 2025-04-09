/*
  Warnings:

  - You are about to drop the `Jobs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `type` on the `ModelConnections` table. All the data in the column will be lost.
  - You are about to drop the column `sidebarOpen` on the `UserSettings` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Jobs";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ModelConnections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "references" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "data" JSONB
);
INSERT INTO "new_ModelConnections" ("createdAt", "data", "description", "id", "modelId", "name", "provider", "references", "updatedAt") SELECT "createdAt", "data", "description", "id", "modelId", "name", "provider", "references", "updatedAt" FROM "ModelConnections";
DROP TABLE "ModelConnections";
ALTER TABLE "new_ModelConnections" RENAME TO "ModelConnections";
CREATE TABLE "new_UserSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "references" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "pageHistory" JSONB,
    "lastPage" TEXT NOT NULL DEFAULT '/',
    "theme" TEXT NOT NULL DEFAULT 'etherial',
    "bootstrapped" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_UserSettings" ("bootstrapped", "createdAt", "id", "lastPage", "pageHistory", "references", "theme", "updatedAt") SELECT "bootstrapped", "createdAt", "id", "lastPage", "pageHistory", "references", "theme", "updatedAt" FROM "UserSettings";
DROP TABLE "UserSettings";
ALTER TABLE "new_UserSettings" RENAME TO "UserSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
