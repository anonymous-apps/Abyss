import { GraphNodeDefinition } from '../graphs-objects/graph-node';
import { NodeHandler } from '../node-handler';
import { NodeExecutionResult, ResolveNodeData } from '../types';

export class WriteChatMessageNode extends NodeHandler {
    constructor() {
        super('write-chat-message');
    }

    protected _getDefinition(): Omit<GraphNodeDefinition, 'id' | 'type'> {
        return {
            name: 'Add Chat Message',
            icon: 'chat',
            description: 'Add a chat message to a given chat history',
            color: '#008000',
            inputPorts: {
                message: {
                    id: 'message',
                    type: 'signal',
                    dataType: 'string',
                    name: 'Message',
                    description: 'The message to add to the chat history',
                },
                chat: {
                    id: 'chat',
                    type: 'data',
                    dataType: 'chat',
                    name: 'Chat',
                    description: 'The chat to add the message to',
                },
            },
            outputPorts: {},
        };
    }

    protected async _resolve(data: ResolveNodeData): Promise<NodeExecutionResult> {
        return {
            portData: [],
        };
    }
}
