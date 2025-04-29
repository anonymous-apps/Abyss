-- CreateTable
CREATE TABLE "MessageThread" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "turns" JSONB NOT NULL
);
