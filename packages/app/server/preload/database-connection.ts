import type { PrismaClient } from '@prisma/client';
import { contextBridge } from 'electron';
import { createRequire } from 'module';
import { v4 as uuidv4 } from 'uuid';
import { PrismaBoostrapper } from './bootstrap/bootstrapData';
import { AgentController } from './controllers/agent';
import { AgentToolConnectionController } from './controllers/agent-tool-connection';
import { ChatController } from './controllers/chat';
import { MessageController } from './controllers/message';
import { MessageThreadController } from './controllers/message-thread';
import { MetricController } from './controllers/metric';
import { ModelConnectionsController } from './controllers/model-connections';
import { RenderedConversationThreadController } from './controllers/rendered-conversation-thread';
import { ResponseStreamController } from './controllers/response-stream';
import { TextLogController } from './controllers/text-log';
import { ToolController } from './controllers/tool';
import { ToolInvocationController } from './controllers/tool-invocation';
import { UserSettingsController } from './controllers/user-settings';
import { CalculateSqliteSize } from './workflows/calculateSqliteSize';
import { InvokeToolFromMessage } from './workflows/invoke-tool';
import { AskAiToRespondToThread } from './workflows/respond-to-thread';
// Setup prisma to support sqlite
const require = createRequire(import.meta.url);
const prismaModule = require('@prisma/client') as {
    PrismaClient: new (options?: any) => PrismaClient;
};
export const prisma = new prismaModule.PrismaClient({
    // log: ['query', 'info', 'warn', 'error'],
});

// Allow subscriptions to database changes
interface DatabaseTableSubscriber {
    subscribers: string[];
    byRecord: Record<string, string[]>;
}
const subscribersById = new Map<string, DatabaseTableSubscriber>();
const subscriberRegistry = new Map<string, (data: any) => void>();

export function addTableSubscriber(table: string, handler: (data: any) => void) {
    const subscriberId = uuidv4();
    const tableKey = table.toLowerCase();
    if (!subscribersById.has(tableKey)) {
        subscribersById.set(tableKey, { subscribers: [], byRecord: {} });
    }
    subscribersById.get(tableKey)!.subscribers.push(subscriberId);
    subscriberRegistry.set(subscriberId, handler);
    return subscriberId;
}

export function addRecordSubscriber(table: string, recordId: string, handler: (data: any) => void) {
    const subscriberId = uuidv4();
    const tableKey = table.toLowerCase();
    if (!subscribersById.has(tableKey)) {
        subscribersById.set(tableKey, { subscribers: [], byRecord: {} });
    }
    if (!subscribersById.get(tableKey)!.byRecord[recordId]) {
        subscribersById.get(tableKey)!.byRecord[recordId] = [];
    }
    subscribersById.get(tableKey)!.byRecord[recordId].push(subscriberId);
    subscriberRegistry.set(subscriberId, handler);
    return subscriberId;
}

export function removeTableSubscriber(table: string, subscriberId: string) {
    const tableKey = table.toLowerCase();
    if (!subscribersById.has(tableKey)) {
        return;
    }
    subscribersById.get(tableKey)!.subscribers = subscribersById.get(tableKey)!.subscribers.filter(s => s !== subscriberId);
    subscriberRegistry.delete(subscriberId);
}

export function removeRecordSubscriber(table: string, recordId: string, subscriberId: string) {
    const tableKey = table.toLowerCase();
    if (!subscribersById.has(tableKey)) {
        return;
    }

    const tableSubscriber = subscribersById.get(tableKey)!;
    const recordSubscribers = tableSubscriber.byRecord[recordId];
    if (!recordSubscribers) {
        return;
    }
    const filteredSubscribers = recordSubscribers.filter(s => s !== subscriberId);
    tableSubscriber.byRecord[recordId] = filteredSubscribers;

    subscriberRegistry.delete(subscriberId);
}

export function notifyTableChanged(table: string, recordId?: string, data?: any) {
    const tableKey = table.toLowerCase();
    if (!subscribersById.has(tableKey)) {
        return;
    }
    const tableSubscriber = subscribersById.get(tableKey)!;
    const subscribers = tableSubscriber.subscribers;

    for (const subscriberId of subscribers) {
        const subscriber = subscriberRegistry.get(subscriberId);
        if (subscriber) {
            subscriber({ table, recordId, data });
        }
    }

    if (!recordId) {
        return;
    }

    const recordSubscribers = tableSubscriber.byRecord[recordId];
    if (!recordSubscribers) {
        return;
    }

    for (const subscriberId of recordSubscribers) {
        const subscriber = subscriberRegistry.get(subscriberId);
        if (subscriber) {
            subscriber({ table, recordId });
        }
    }
}

const tableControllers = {
    modelConnections: ModelConnectionsController.export(),
    userSettings: UserSettingsController.export(),
    messageThread: MessageThreadController.export(),
    message: MessageController.export(),
    renderedConversationThread: RenderedConversationThreadController.export(),
    chat: ChatController.export(),
    agent: AgentController.export(),
    agentToolConnection: AgentToolConnectionController.export(),
    tool: ToolController.export(),
    toolInvocation: ToolInvocationController.export(),
    metric: MetricController.export(),
    textLog: TextLogController.export(),
    responseStream: ResponseStreamController.export(),
};

const PrismaAPI = {
    // Subscriber to table changes
    subscribeTable: (table: string, handler: (data: any) => void) => {
        return addTableSubscriber(table, handler);
    },
    subscribeRecord: (table: string, recordId: string, handler: (data: any) => void) => {
        return addRecordSubscriber(table, recordId, handler);
    },
    unsubscribeTable: (table: string, subscriberId: string) => {
        return removeTableSubscriber(table, subscriberId);
    },
    unsubscribeRecord: (table: string, recordId: string, subscriberId: string) => {
        return removeRecordSubscriber(table, recordId, subscriberId);
    },

    describeTables: async () => {
        const tableKeys = Object.keys(tableControllers);
        const tableStats: { name: string; recordCount: number; description: string }[] = [];

        for (const tableName of tableKeys) {
            const table = prisma[tableName];
            const controller = tableControllers[tableName];
            const count = await table.count();

            tableStats.push({
                name: tableName,
                recordCount: count,
                description: controller.description,
            });
        }
        return tableStats;
    },

    // Access to database tables
    table: tableControllers,

    workflows: {
        AskAiToRespondToThread,
        InvokeToolFromMessage,
        CalculateSqliteSize,
    },

    bootstrap: {
        bootstrapping: PrismaBoostrapper,
    },
};

contextBridge.exposeInMainWorld('prisma', PrismaAPI);
export type PrismaAPI = typeof PrismaAPI;
