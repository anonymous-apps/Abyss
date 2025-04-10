/*
  Warnings:

  - You are about to drop the `NetworkCall` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "NetworkCall";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RenderedConversationThread" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "references" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "messages" TEXT NOT NULL
);
INSERT INTO "new_RenderedConversationThread" ("createdAt", "id", "messages", "references", "updatedAt") SELECT "createdAt", "id", "messages", "references", "updatedAt" FROM "RenderedConversationThread";
DROP TABLE "RenderedConversationThread";
ALTER TABLE "new_RenderedConversationThread" RENAME TO "RenderedConversationThread";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
