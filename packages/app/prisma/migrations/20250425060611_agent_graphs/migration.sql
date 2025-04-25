/*
  Warnings:

  - You are about to drop the `AgentToolConnection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `chatModelId` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `systemPromptId` on the `Agent` table. All the data in the column will be lost.
  - Added the required column `graph` to the `Agent` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AgentToolConnection";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Agent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "references" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "graph" JSONB NOT NULL
);
INSERT INTO "new_Agent" ("createdAt", "description", "id", "name", "references", "updatedAt") SELECT "createdAt", "description", "id", "name", "references", "updatedAt" FROM "Agent";
DROP TABLE "Agent";
ALTER TABLE "new_Agent" RENAME TO "Agent";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
