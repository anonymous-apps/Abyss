-- CreateTable
CREATE TABLE "ResponseStream" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "references" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "sourceId" TEXT NOT NULL,
    "parsedMessages" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "rawOutput" TEXT NOT NULL
);
