import { ReferencedChatThreadRecord, ReferencedMessageRecord } from '@abyss/records';
import { randomId } from '../../utils/ids';
import { NodeHandler } from '../node-handler';
import { NodeExecutionResult, ResolveNodeData } from '../type-base.type';
import { GraphNodeDefinition } from '../type-definition.type';

export class WriteAgentMessageNode extends NodeHandler {
    constructor() {
        super('write-agent-message', 'dynamic');
    }

    protected _getDefinition(): Omit<GraphNodeDefinition, 'id' | 'type'> {
        return {
            name: 'Add Agent Message',
            icon: 'chat',
            description: 'Add a message to a given chat history sent from this agent',
            color: '#008000',
            parameters: {},
            inputPorts: {
                trigger: {
                    id: 'trigger',
                    type: 'signal',
                    dataType: 'signal',
                    name: 'Trigger',
                    description: 'Trigger the write agent message',
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
            },
        };
    }

    protected async _resolve(data: ResolveNodeData): Promise<NodeExecutionResult> {
        const message = data.resolvePort<string>('message');
        const chat = data.resolvePort<ReferencedChatThreadRecord>('chat');

        const messageCreated = await chat.client.tables.message.create({
            senderId: data.execution.graph.id,
            type: 'text',
            payloadData: {
                content: message,
            },
        });
        await chat.addMessages(new ReferencedMessageRecord(messageCreated.id, chat.client));

        return {
            portData: [
                {
                    portId: 'next',
                    dataType: 'signal',
                    inputValue: randomId(),
                },
            ],
        };
    }
}
