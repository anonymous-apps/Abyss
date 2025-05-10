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
            description: 'Triggered after a chat message is sent to a chat with this agent',
            color: '#FFA500',
            inputPorts: {},
            parameters: {},
            outputPorts: {
                chat: {
                    id: 'chat',
                    type: 'data',
                    dataType: 'chat',
                    name: 'Chat',
                    description: 'The chat that the message was sent to',
                },
                onChatMessage: {
                    id: 'onChatMessage',
                    type: 'signal',
                    dataType: 'signal',
                    name: 'On Chat Message',
                    description: 'What to do when a chat message is sent to a chat with this agent',
                },
            },
        };
    }
}
