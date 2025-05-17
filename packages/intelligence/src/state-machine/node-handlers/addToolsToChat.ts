import { type ReferencedChatThreadRecord, ReferencedMessageRecord, type ReferencedToolDefinitionRecord } from '@abyss/records';
import { randomId } from '../../utils/ids';
import { NodeHandler } from '../node-handler';
import type { NodeExecutionResult, ResolveNodeData } from '../type-base.type';
import type { GraphNodeDefinition } from '../type-definition.type';

export class AddToolsToThreadNode extends NodeHandler {
    constructor() {
        super('add-tools-to-thread', 'static');
    }
    protected _getDefinition(): Omit<GraphNodeDefinition, 'id' | 'type'> {
        return {
            name: 'Set Tools in Chat',
            icon: 'tool',
            description: 'Add tools to the chat, resulting in a new chat with only the selected tools',
            color: '#d01010',
            parameters: {},
            inputPorts: {
                trigger: {
                    id: 'trigger',
                    type: 'signal',
                    dataType: 'signal',
                    name: 'Trigger',
                    description: 'Trigger the add tools to thread',
                },
                chat: {
                    id: 'chat',
                    type: 'data',
                    dataType: 'chat',
                    name: 'Chat',
                    description: 'A chat to set the tools for',
                },
                toolSet: {
                    id: 'toolSet',
                    type: 'data',
                    dataType: 'tool-set',
                    name: 'Tools',
                    description: 'The tools to set in the chat',
                },
            },
            outputPorts: {
                chat: {
                    id: 'chat',
                    type: 'data',
                    dataType: 'chat',
                    name: 'Chat',
                    description: 'A reference to the input chat',
                },
                next: {
                    id: 'next',
                    type: 'signal',
                    dataType: 'signal',
                    name: 'Next',
                    description: 'What to do next',
                },
            },
        };
    }

    protected async _resolve(data: ResolveNodeData): Promise<NodeExecutionResult> {
        // Compute Delta Tool Definitions
        const chat = data.resolvePort<ReferencedChatThreadRecord>('chat');
        const toolSet = data.resolvePort<ReferencedToolDefinitionRecord[]>('toolSet');
        const currentThread = await chat.getThread();
        const deltaToolDefinitions = await currentThread.getDeltaToolDefinitions(toolSet);

        // Add Messages to Chat
        const toolsToAddRecords = await Promise.all(deltaToolDefinitions.toolsToAdd.map(t => t.get()));
        const toolsToAddMessages = await chat.client.tables.message.create({
            type: 'new-tool-definition',
            senderId: 'system',
            payloadData: {
                tools: toolsToAddRecords.map(t => ({
                    toolId: t.id,
                    shortName: t.shortName,
                    description: t.description,
                    inputSchemaData: t.inputSchemaData,
                    outputSchemaData: t.outputSchemaData,
                })),
            },
        });
        const toolsToRemoveRecords = await Promise.all(deltaToolDefinitions.toolsToRemove.map(t => t.get()));
        const toolsToRemoveMessages = await chat.client.tables.message.create({
            type: 'remove-tool-definition',
            senderId: 'system',
            payloadData: {
                tools: toolsToRemoveRecords.map(t => t.id),
            },
        });

        // Add linked documents to chat
        const linkedDocuments = toolsToAddRecords.flatMap(t => t.linkedDocumentData || []);
        const missingDocuments = await currentThread.getDeltaReadonlyDocuments(linkedDocuments);
        const linkedDocumentsMessages = await chat.client.tables.message.create({
            type: 'readonly-document',
            senderId: 'system',
            payloadData: { documentIds: missingDocuments },
        });

        await chat.addMessages(
            new ReferencedMessageRecord(toolsToAddMessages.id, chat.client),
            new ReferencedMessageRecord(toolsToRemoveMessages.id, chat.client),
            new ReferencedMessageRecord(linkedDocumentsMessages.id, chat.client)
        );

        return {
            portData: [
                {
                    portId: 'chat',
                    dataType: 'chat',
                    inputValue: chat,
                },
                {
                    portId: 'next',
                    dataType: 'signal',
                    inputValue: randomId(),
                },
            ],
        };
    }
}
