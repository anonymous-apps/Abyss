import { Chat } from '../../constructs';
import { NodeHandler } from '../node-handler';
import { GraphNodeDefinition } from '../object-definitions/graph-node';
import { NodeExecutionResult, ResolveNodeData } from '../type-base.type';

export class WriteChatMessageNode extends NodeHandler {
    constructor() {
        super('write-chat-message', 'dynamic');
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
        const message = data.resolvePort<string>('message');
        const chat = data.resolvePort<Chat>('chat');
        const thread = await chat.getThread();
        const outThread = await thread.addPartialWithSender('user', {
            type: 'text',
            text: {
                content: message,
            },
        });
        await chat.updateThread(outThread.id);

        return {
            portData: [],
        };
    }
}
