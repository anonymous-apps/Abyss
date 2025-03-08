-- AlterTable
ALTER TABLE "Message" ADD COLUMN "renderedId" TEXT;

-- CreateTable
CREATE TABLE "RenderedConversationThread" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "messages" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
