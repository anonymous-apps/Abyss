import { buildCleanDB } from '../../sqlite/sqlite-client.mock';
import type { ToolDefinitionType } from '../tool-definition/tool-definition.type';

export async function setupThreadWithTextMessages() {
    const client = await buildCleanDB();
    const threadRecord = await client.tables.messageThread.new();
    const threadRef = client.tables.messageThread.ref(threadRecord.id);
    await threadRef.addMessagePartials(
        {
            senderId: 'user1',
            type: 'text',
            payloadData: { content: 'Hello' },
        },
        {
            senderId: 'user1',
            type: 'text',
            payloadData: { content: 'World' },
        },
        {
            senderId: 'agent1',
            type: 'text',
            payloadData: { content: 'Hi there' },
        }
    );
    return { client, threadRef };
}

export async function setupThreadWithToolLifecycle() {
    const { client, threadRef } = await setupThreadWithTextMessages();
    const toolDef1Data: Omit<ToolDefinitionType, 'id' | 'createdAt' | 'updatedAt'> = {
        name: 'Tool A',
        shortName: 'tool-a',
        description: 'Desc A',
        handlerType: 'abyss',
        inputSchemaData: [],
        outputSchemaData: [],
    };
    const toolDef2Data: Omit<ToolDefinitionType, 'id' | 'createdAt' | 'updatedAt'> = {
        name: 'Tool B',
        shortName: 'tool-b',
        description: 'Desc B',
        handlerType: 'abyss',
        inputSchemaData: [],
        outputSchemaData: [],
    };
    const tool1 = await client.tables.toolDefinition.create(toolDef1Data);
    const tool2 = await client.tables.toolDefinition.create(toolDef2Data);

    const toolDefinitionPayloadItem = (td: ToolDefinitionType) => ({
        toolId: td.id,
        shortName: td.shortName,
        description: td.description,
        inputSchemaData: td.inputSchemaData,
        outputSchemaData: td.outputSchemaData,
    });

    await threadRef.addMessagePartials({
        senderId: 'system',
        type: 'new-tool-definition',
        payloadData: { tools: [toolDefinitionPayloadItem(tool1), toolDefinitionPayloadItem(tool2)] },
    });
    return { client, threadRef, tool1, tool2 };
}

export async function setupThreadWithToolCalls() {
    const { client, threadRef } = await setupThreadWithToolLifecycle();
    const toolDefData: Omit<ToolDefinitionType, 'id' | 'createdAt' | 'updatedAt'> = {
        name: 'Test Tool',
        shortName: 'test-tool',
        description: '',
        handlerType: 'abyss',
        inputSchemaData: [],
        outputSchemaData: [],
    };
    const toolDef = await client.tables.toolDefinition.create(toolDefData);

    await threadRef.addMessagePartials(
        {
            type: 'tool-call-request',
            senderId: 'agent',
            payloadData: { toolCallId: 'call1', toolId: toolDef.id, shortName: toolDef.shortName, parameters: { p: 1 } },
        },
        {
            type: 'tool-call-request',
            senderId: 'agent',
            payloadData: { toolCallId: 'call2', toolId: toolDef.id, shortName: toolDef.shortName, parameters: { p: 2 } },
        }
    );
    return { client, threadRef, toolDef };
}
