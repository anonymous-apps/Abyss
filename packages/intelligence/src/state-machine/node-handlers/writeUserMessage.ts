import { ReferencedChatThreadRecord } from '@abyss/records';
import { randomId } from '../../utils/ids';
import { NodeHandler } from '../node-handler';
import { NodeExecutionResult, ResolveNodeData } from '../type-base.type';
import { GraphNodeDefinition } from '../type-definition.type';

export class WriteUserMessageNode extends NodeHandler {
    constructor() {
        super('write-user-message', 'dynamic');
    }

    protected _getDefinition(): Omit<GraphNodeDefinition, 'id' | 'type'> {
        return {
            name: 'Add User Message',
            icon: 'chat',
            description: 'Add a message to a given chat history sent from the user',
            color: '#008000',
            parameters: {},
            inputPorts: {
                write: {
                    id: 'write',
                    type: 'signal',
                    dataType: 'signal',
                    name: 'Write',
                    description: 'Write the user message',
                },
                message: {
                    id: 'message',
                    type: 'data',
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
            outputPorts: {
                next: {
                    id: 'next',
                    type: 'signal',
                    dataType: 'signal',
                    name: 'Next',
                    description: 'What to do next',
                },
                thread: {
                    id: 'thread',
                    type: 'data',
                    dataType: 'thread',
                    name: 'Thread',
                    description: 'The thread with the new message added',
                },
            },
        };
    }

    protected async _resolve(data: ResolveNodeData): Promise<NodeExecutionResult> {
        const message = data.resolvePort<string>('message');
        const chat = data.resolvePort<ReferencedChatThreadRecord>('chat');

        await chat.addMessages({
            senderId: 'user',
            type: 'text',
            payloadData: {
                content: message,
            },
        });

        const chatData = await chat.get();
        const thread = data.database.tables.messageThread.ref(chatData.threadId);

        return {
            portData: [
                {
                    portId: 'next',
                    dataType: 'signal',
                    inputValue: randomId(),
                },
                {
                    portId: 'thread',
                    dataType: 'thread',
                    inputValue: thread,
                },
            ],
        };
    }
}
