import { GraphNodeDefinition } from '../../constructs/graphs/graph-node';
import { NodeHandler } from '../node-handler';
import { NodeExecutionResult, ResolveNodeData } from '../types';

export class OnChatMessageNode extends NodeHandler {
    constructor() {
        super('on-chat-message');
    }

    protected _getDefinition(): Omit<GraphNodeDefinition, 'id' | 'type'> {
        return {
            name: 'On Chat Message',
            description: 'Triggered when a chat message is sent to a chat with this agent',
            color: '#000000',
            inputPorts: {},
            outputPorts: {
                userMessage: {
                    id: 'message',
                    type: 'data',
                    dataType: 'string',
                    name: 'Message',
                    description: 'The message raw sent to the agent chat',
                },
                thread: {
                    id: 'thread',
                    type: 'data',
                    dataType: 'chat-thread',
                    name: 'Thread',
                    description: 'A thread representing the chat history with the newly sent message',
                },
            },
        };
    }

    protected async _resolve(data: ResolveNodeData): Promise<NodeExecutionResult> {
        return {
            portData: [],
        };
    }
}
