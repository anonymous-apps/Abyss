/*
  Warnings:

  - You are about to drop the column `description` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `sourceId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Message` table. All the data in the column will be lost.
  - You are about to alter the column `content` on the `Message` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "references" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "threadId" TEXT
);
INSERT INTO "new_Chat" ("createdAt", "id", "name", "references", "threadId", "updatedAt") SELECT "createdAt", "id", "name", "references", "threadId", "updatedAt" FROM "Chat";
DROP TABLE "Chat";
ALTER TABLE "new_Chat" RENAME TO "Chat";
CREATE TABLE "new_Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "references" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "threadId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "content" JSONB NOT NULL
);
INSERT INTO "new_Message" ("content", "createdAt", "id", "references", "sourceId", "threadId", "updatedAt") SELECT "content", "createdAt", "id", "references", "sourceId", "threadId", "updatedAt" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
