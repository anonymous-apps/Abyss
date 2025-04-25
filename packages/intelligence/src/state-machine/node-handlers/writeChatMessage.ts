import { GraphNodeDefinition } from '../../constructs/graphs/graph-node';
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
                chatId: {
                    id: 'chatId',
                    type: 'data',
                    dataType: 'string',
                    name: 'Chat ID',
                    description: 'The ID of the chat to add the message to',
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
