import { ReferencedSqliteRecord } from '../../sqlite/reference-record';
import { ReferencedSqliteTable } from '../../sqlite/reference-table';
import { SQliteClient } from '../../sqlite/sqlite-client';
import { NewRecord } from '../../sqlite/sqlite.type';
import { ReferencedMessageRecord } from '../message/message';
import { MessageType, ToolCallRequestPartial } from '../message/message.type';
import { ReferencedToolDefinitionRecord } from '../tool-definition/tool-definition';
import { MessageThreadType } from './message-thread.type';

export class ReferencedMessageThreadTable extends ReferencedSqliteTable<MessageThreadType> {
    constructor(client: SQliteClient) {
        super('messageThread', 'A thread of messages with different types of content', client);
    }

    public ref(id: string) {
        return new ReferencedMessageThreadRecord(id, this.client);
    }

    public async new() {
        return await this.create({ messagesData: [] });
    }
}
export class ReferencedMessageThreadRecord extends ReferencedSqliteRecord<MessageThreadType> {
    constructor(id: string, client: SQliteClient) {
        super('messageThread', id, client);
    }

    public async addMessagesByReference(...messages: ReferencedMessageRecord[]) {
        const clone = await this.clone();
        const clonedData = await clone.get();
        const newMessages = [...clonedData.messagesData, ...messages.map(m => ({ id: m.id }))];
        await clone.update({ messagesData: newMessages });
        return clone;
    }

    public async addMessages(...messages: NewRecord<MessageType>[]) {
        const newMessages = await this.client.tables.message.createMany(messages);
        const refs = newMessages.map(m => new ReferencedMessageRecord(m.id, this.client));
        return this.addMessagesByReference(...refs);
    }

    public async getAllMessages() {
        const data = await this.get();
        const refs = data.messagesData.map(m => new ReferencedMessageRecord(m.id, this.client));
        return await Promise.all(refs.map(r => r.get()));
    }

    public async getTurns() {
        const messages = await this.getAllMessages();

        const turns: {
            senderId: string;
            messages: MessageType[];
        }[] = [];

        for (const message of messages) {
            const lastTurn = turns.length === 0 ? '' : turns[turns.length - 1].senderId;
            if (message.senderId === lastTurn) {
                turns[turns.length - 1].messages.push(message);
            } else {
                turns.push({
                    senderId: message.senderId,
                    messages: [message],
                });
            }
        }
        return turns;
    }

    public async getAllActiveToolDefinitions() {
        let activeToolDefinitions: {
            id: string;
            shortName: string;
            ref: ReferencedToolDefinitionRecord;
        }[] = [];
        const messages = await this.getAllMessages();
        for (const message of messages) {
            if (message.type === 'new-tool-definition') {
                for (const tool of message.payloadData.tools) {
                    activeToolDefinitions.push({
                        id: tool.toolId,
                        shortName: tool.shortName,
                        ref: new ReferencedToolDefinitionRecord(tool.toolId, this.client),
                    });
                }
            }
            if (message.type === 'remove-tool-definition') {
                for (const toolId of message.payloadData.tools) {
                    activeToolDefinitions = activeToolDefinitions.filter(t => t.id !== toolId);
                }
            }
        }
        return activeToolDefinitions;
    }

    public async getDeltaToolDefinitions(newToolDefinitions: ReferencedToolDefinitionRecord[]) {
        const toolDefinitionData = await Promise.all(newToolDefinitions.map(t => t.get()));
        const newToolDefinitionMessages = toolDefinitionData.map(t => ({
            toolId: t.id,
            shortName: t.name,
            description: t.description,
            inputSchemaData: t.inputSchemaData,
            outputSchemaData: t.outputSchemaData,
        }));

        const currentToolDefinitions = await this.getAllActiveToolDefinitions();
        const toolsToRemove = currentToolDefinitions.filter(t => !newToolDefinitionMessages.some(n => n.toolId === t.id));
        const toolsToAdd = newToolDefinitionMessages.filter(t => !currentToolDefinitions.some(c => c.id === t.toolId));

        const toolsToAddMessage = await this.client.tables.message.create({
            type: 'new-tool-definition',
            senderId: 'system',
            payloadData: {
                tools: toolsToAdd,
            },
        });

        const toolsToRemoveMessage = await this.client.tables.message.create({
            type: 'remove-tool-definition',
            senderId: 'system',
            payloadData: {
                tools: toolsToRemove.map(t => t.id),
            },
        });

        return {
            toolsToAddMessage: new ReferencedMessageRecord(toolsToAddMessage.id, this.client),
            toolsToRemoveMessage: new ReferencedMessageRecord(toolsToRemoveMessage.id, this.client),
        };
    }

    public async getUnprocessedToolCalls() {
        const messages = await this.getAllMessages();
        let getUnprocessedToolCalls: ToolCallRequestPartial[] = [];
        for (const message of messages) {
            if (message.type === 'tool-call-request') {
                getUnprocessedToolCalls.push(message);
            }
            if (message.type === 'tool-call-response') {
                getUnprocessedToolCalls = getUnprocessedToolCalls.filter(t => t.id !== message.id);
            }
        }
        return getUnprocessedToolCalls;
    }
}
