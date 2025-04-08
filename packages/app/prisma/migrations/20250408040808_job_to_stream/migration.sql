/*
  Warnings:

  - You are about to drop the column `lockingJobId` on the `MessageThread` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ResponseStream" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "references" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "sourceId" TEXT NOT NULL,
    "resultMessages" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "rawOutput" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MessageThread" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "references" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lockingId" TEXT
);
INSERT INTO "new_MessageThread" ("createdAt", "id", "references", "updatedAt") SELECT "createdAt", "id", "references", "updatedAt" FROM "MessageThread";
DROP TABLE "MessageThread";
ALTER TABLE "new_MessageThread" RENAME TO "MessageThread";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
