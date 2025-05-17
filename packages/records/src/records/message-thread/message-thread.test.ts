import { describe, expect, test } from 'vitest';
import type { ToolDefinitionType } from '../tool-definition/tool-definition.type';
import { setupThreadWithTextMessages, setupThreadWithToolCalls, setupThreadWithToolLifecycle } from './message-thread.mock';

describe('Message Thread Table Reference', () => {
    test('can create a new message thread and get a reference to it', async () => {
        const { client, threadRef } = await setupThreadWithTextMessages();
        const fetchedThreadData = await threadRef.get();
        const referencedThreadRef = client.tables.messageThread.ref(fetchedThreadData.id);
        const resolvedRef = await referencedThreadRef.get();
        expect(resolvedRef.id).toEqual(fetchedThreadData.id);
    });
});

describe('Message Thread Record Functionality', () => {
    test('can get all messages in the thread', async () => {
        const { threadRef } = await setupThreadWithTextMessages();
        const allMessages = await threadRef.getAllMessages();
        expect(allMessages.length).toBe(3);
    });

    test('can get turns which group messages by senderId', async () => {
        const { threadRef } = await setupThreadWithTextMessages();
        const turns = await threadRef.getTurns();
        expect(turns.length).toBe(2);
        expect(turns[0].senderId).toBe('user1');
        expect(turns[0].messages.length).toBe(2);
        expect(turns[1].senderId).toBe('agent1');
        expect(turns[1].messages.length).toBe(1);
    });

    test('can get active tool definitions', async () => {
        const { threadRef, tool1, tool2 } = await setupThreadWithToolLifecycle();
        const activeTools = await threadRef.getAllActiveToolDefinitions();
        expect(activeTools.length).toBe(2);
        expect(activeTools.map(t => t.id)).toEqual(expect.arrayContaining([tool1.id, tool2.id]));
    });

    test('get active tool definitions returns empty if no tool definition messages added', async () => {
        const { threadRef } = await setupThreadWithTextMessages();
        const activeTools = await threadRef.getAllActiveToolDefinitions();
        expect(activeTools.length).toBe(0);
    });

    test('get active tool definitions reflects removals', async () => {
        const { threadRef, tool1, tool2 } = await setupThreadWithToolLifecycle();
        await threadRef.addMessagePartials({
            senderId: 'system',
            type: 'remove-tool-definition',
            payloadData: { tools: [tool1.id] },
        });
        const activeTools = await threadRef.getAllActiveToolDefinitions();
        expect(activeTools.length).toBe(1);
        expect(activeTools[0].id).toBe(tool2.id);
    });

    test('getDeltaToolDefinitions identifies tools to add and remove', async () => {
        const { threadRef, tool1, tool2 } = await setupThreadWithToolLifecycle();
        const toolDef3Data: Omit<ToolDefinitionType, 'id' | 'createdAt' | 'updatedAt'> = {
            name: 'Tool C',
            shortName: 'tool-c',
            handlerType: 'abyss',
            description: '',
            inputSchemaData: [],
            outputSchemaData: [],
        };
        const tool3 = await threadRef.client.tables.toolDefinition.create(toolDef3Data);
        const tool2Ref = threadRef.client.tables.toolDefinition.ref(tool2.id);
        const tool3Ref = threadRef.client.tables.toolDefinition.ref(tool3.id);

        const { toolsToAdd, toolsToRemove } = await threadRef.getDeltaToolDefinitions([tool2Ref, tool3Ref]);
        expect(toolsToAdd.map(t => t.id)).toEqual(expect.arrayContaining([tool3.id]));
        expect(toolsToAdd.length).toBe(1);
        expect(toolsToRemove.map(t => t.id)).toEqual(expect.arrayContaining([tool1.id]));
        expect(toolsToRemove.length).toBe(1);
    });

    test('getDeltaReadonlyDocuments identifies missing documents', async () => {
        const { threadRef } = await setupThreadWithTextMessages();
        await threadRef.addMessagePartials({
            type: 'readonly-document',
            senderId: 'system',
            payloadData: { documentIds: ['doc1', 'doc2'] },
        });

        const missing = await threadRef.getDeltaReadonlyDocuments(['doc2', 'doc3']);
        expect(missing).toEqual(['doc3']);
    });

    test('getDeltaReadonlyDocuments returns empty if no changes needed', async () => {
        const { threadRef } = await setupThreadWithTextMessages();
        await threadRef.addMessagePartials({
            type: 'readonly-document',
            senderId: 'system',
            payloadData: { documentIds: ['doc1', 'doc2'] },
        });

        const missing = await threadRef.getDeltaReadonlyDocuments(['doc1', 'doc2']);
        expect(missing).toEqual([]);
    });

    test('getUnprocessedToolCalls returns empty if no tool calls', async () => {
        const { threadRef } = await setupThreadWithTextMessages();
        const unprocessed = await threadRef.getUnprocessedToolCalls();
        expect(Object.keys(unprocessed).length).toBe(0);
    });

    test('getUnprocessedToolCalls returns correct calls and updates after response', async () => {
        const { threadRef, toolDef } = await setupThreadWithToolCalls();

        let unprocessed = await threadRef.getUnprocessedToolCalls();
        expect(Object.keys(unprocessed).length).toBe(2);
        expect(unprocessed.call1).toBeDefined();
        expect(unprocessed.call2).toBeDefined();

        await threadRef.addMessagePartials({
            type: 'tool-call-response',
            senderId: 'system',
            payloadData: { toolCallId: 'call1', shortName: toolDef.shortName, status: 'success', result: 'ok' },
        });

        unprocessed = await threadRef.getUnprocessedToolCalls();
        expect(Object.keys(unprocessed).length).toBe(1);
        expect(unprocessed.call2).toBeDefined();
        expect(unprocessed.call1).toBeUndefined();
    });
});
