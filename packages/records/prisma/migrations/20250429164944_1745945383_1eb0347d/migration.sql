-- CreateTable
CREATE TABLE "chatThread" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL
);
