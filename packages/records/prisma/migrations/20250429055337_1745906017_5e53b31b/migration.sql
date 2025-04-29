/*
  Warnings:

  - You are about to drop the `ModelConnection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ModelConnection";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "TextDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "previousId" TEXT,
    "nextId" TEXT
);
