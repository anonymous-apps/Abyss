import { ReferencedSqliteRecord } from '../../sqlite/reference-record';
import { ReferencedSqliteTable } from '../../sqlite/reference-table';
import type { NewRecord } from '../../sqlite/sqlite.type';
import type { SQliteClient } from '../../sqlite/sqlite-client';
import { ReferencedMessageRecord } from '../message/message';
import type { MessageType } from '../message/message.type';
import { ReferencedToolDefinitionRecord } from '../tool-definition/tool-definition';
import type { MessageThreadTurn, MessageThreadType } from './message-thread.type';

export class ReferencedMessageThreadTable extends ReferencedSqliteTable<MessageThreadType> {
    constructor(client: SQliteClient) {
        super('messageThread', 'A thread of messages with different types of content', client);
    }

    public ref(id: string) {
        return new ReferencedMessageThreadRecord(id, this.client);
    }

    public async new() {
        return await this.create({
            name: 'New Message Thread',
            messagesData: [],
        });
    }
}

export class ReferencedMessageThreadRecord extends ReferencedSqliteRecord<MessageThreadType> {
    constructor(id: string, client: SQliteClient) {
        super('messageThread', id, client);
    }

    //
    // Messages
    //

    private async _internalAddMessagesByIds(ids: string[]): Promise<void> {
        const data = await this.get();
        const newMessagesData = [...data.messagesData, ...ids.map(id => ({ id }))];
        await this.update({ messagesData: newMessagesData });
    }

    public async addMessagePartials(...messages: NewRecord<MessageType>[]) {
        const createdMessages = await Promise.all(messages.map(m => this.client.tables.message.create(m)));
        await this._internalAddMessagesByIds(createdMessages.map(m => m.id));
    }

    public async addMessages(...messages: ReferencedMessageRecord[]) {
        await this._internalAddMessagesByIds(messages.map(m => m.id));
    }

    public async getAllMessages() {
        const data = await this.get();
        const refs = data.messagesData.map(m => new ReferencedMessageRecord(m.id, this.client));
        return await Promise.all(refs.map(r => r.get()));
    }

    //
    // Modify
    //

    public async setName(name: string) {
        await this.update({ name });
    }

    public async setParticipantId(participantId: string) {
        await this.update({ participantId });
    }

    public async block(blockerId: string) {
        await this.update({ blockerId });
    }

    public async unblock() {
        await this.update({ blockerId: null });
    }

    //
    // Metadata
    //

    public async getTurns() {
        const turns: MessageThreadTurn[] = [];
        const messages = await this.getAllMessages();
        for (const message of messages) {
            const lastTurn = turns[turns.length - 1]?.senderId;
            const isNewTurn = lastTurn !== message.senderId;
            if (isNewTurn) {
                turns.push({
                    senderId: message.senderId,
                    messages: [message],
                });
            } else {
                turns[turns.length - 1].messages.push(message);
            }
        }
        return turns;
    }

    public async getAllActiveToolDefinitions() {
        const activeToolDefinitions: Record<string, ReferencedToolDefinitionRecord> = {};
        const messages = await this.getAllMessages();
        for (const message of messages) {
            if (message.type === 'new-tool-definition') {
                for (const tool of message.payloadData.tools) {
                    activeToolDefinitions[tool.toolId] = new ReferencedToolDefinitionRecord(tool.toolId, this.client);
                }
            }
            if (message.type === 'remove-tool-definition') {
                for (const toolId of message.payloadData.tools) {
                    delete activeToolDefinitions[toolId];
                }
            }
        }
        return Object.values(activeToolDefinitions);
    }

    public async getDeltaToolDefinitions(newToolDefinitions: ReferencedToolDefinitionRecord[]) {
        const activeToolDefinitions = await this.getAllActiveToolDefinitions();
        const toolsToAdd = newToolDefinitions.filter(t => !activeToolDefinitions.some(a => a.id === t.id));
        const toolsToRemove = activeToolDefinitions.filter(t => !newToolDefinitions.some(n => n.id === t.id));
        return { toolsToAdd, toolsToRemove };
    }

    public async getDeltaReadonlyDocuments(documentIds: string[]) {
        const messages = await this.getAllMessages();
        const foundDocuments: Set<string> = new Set();
        for (const message of messages) {
            if (message.type === 'readonly-document') {
                for (const documentId of message.payloadData.documentIds) {
                    foundDocuments.add(documentId);
                }
            }
        }
        const missingDocuments = documentIds.filter(id => !foundDocuments.has(id));
        return missingDocuments;
    }

    public async getUnprocessedToolCalls() {
        const messages = await this.getAllMessages();
        const getUnprocessedToolCalls: Record<string, ReferencedMessageRecord> = {};
        for (const message of messages) {
            if (message.type === 'tool-call-request') {
                getUnprocessedToolCalls[message.payloadData.toolCallId] = new ReferencedMessageRecord(message.id, this.client);
            }
            if (message.type === 'tool-call-response') {
                delete getUnprocessedToolCalls[message.payloadData.toolCallId];
            }
        }
        return getUnprocessedToolCalls;
    }
}
