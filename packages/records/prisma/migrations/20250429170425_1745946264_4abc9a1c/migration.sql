-- CreateTable
CREATE TABLE "AgentGraph" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AgentGraphNode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "nodeId" TEXT NOT NULL,
    "positionX" REAL NOT NULL,
    "positionY" REAL NOT NULL,
    "parameters" JSONB NOT NULL,
    "graphId" TEXT NOT NULL,
    CONSTRAINT "AgentGraphNode_graphId_fkey" FOREIGN KEY ("graphId") REFERENCES "AgentGraph" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AgentGraphEdge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "sourceNodeId" TEXT NOT NULL,
    "sourcePortId" TEXT NOT NULL,
    "targetNodeId" TEXT NOT NULL,
    "targetPortId" TEXT NOT NULL,
    "graphId" TEXT NOT NULL,
    CONSTRAINT "AgentGraphEdge_graphId_fkey" FOREIGN KEY ("graphId") REFERENCES "AgentGraph" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
