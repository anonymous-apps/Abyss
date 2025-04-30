/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Metric` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Settings` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Metric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "dimensions" JSONB NOT NULL,
    "value" REAL NOT NULL
);
INSERT INTO "new_Metric" ("createdAt", "dimensions", "id", "name", "value") SELECT "createdAt", "dimensions", "id", "name", "value" FROM "Metric";
DROP TABLE "Metric";
ALTER TABLE "new_Metric" RENAME TO "Metric";
CREATE TABLE "new_Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lastPage" TEXT NOT NULL,
    "theme" TEXT NOT NULL
);
INSERT INTO "new_Settings" ("id", "lastPage", "theme") SELECT "id", "lastPage", "theme" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
