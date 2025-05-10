import { ReferencedChatThreadRecord, ReferencedToolDefinitionRecord } from '@abyss/records';
import { randomId } from '../../utils/ids';
import { NodeHandler } from '../node-handler';
import { NodeExecutionResult, ResolveNodeData } from '../type-base.type';
import { GraphNodeDefinition } from '../type-definition.type';

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
        await chat.addMessagesByReference(deltaToolDefinitions.toolsToAddMessage, deltaToolDefinitions.toolsToRemoveMessage);

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
