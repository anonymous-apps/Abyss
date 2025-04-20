/*
  Warnings:

  - You are about to drop the `ResponseStream` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ResponseStream";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ModelInvoke" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "references" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "sourceId" TEXT NOT NULL,
    "parsedMessages" JSONB NOT NULL,
    "rawOutput" TEXT NOT NULL
);
