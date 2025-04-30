import { NodeHandler } from '../node-handler';
import { GraphNodeDefinition } from '../type-definition.type';

export class OnChatMessageNode extends NodeHandler {
    constructor() {
        super('on-chat-message', 'trigger');
    }

    protected _getDefinition(): Omit<GraphNodeDefinition, 'id' | 'type'> {
        return {
            name: 'On Chat Message',
            icon: 'chat',
            description: 'Triggered when a chat message is sent to a chat with this agent',
            color: '#FFA500',
            inputPorts: {},
            parameters: {},
            outputPorts: {
                thread: {
                    id: 'thread',
                    type: 'data',
                    dataType: 'thread',
                    name: 'Thread',
                    description: 'A thread representing the chat history with the newly sent user message',
                },
                message: {
                    id: 'message',
                    type: 'data',
                    dataType: 'string',
                    name: 'Message',
                    description: 'The raw text message that was just sent to the chat',
                },
                chat: {
                    id: 'chat',
                    type: 'data',
                    dataType: 'chat',
                    name: 'Chat',
                    description: 'The chat that the message was sent to',
                },
            },
        };
    }
}
