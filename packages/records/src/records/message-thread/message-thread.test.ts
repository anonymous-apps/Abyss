import { beforeEach, describe, expect, test } from 'vitest';
import type { NewRecord } from '../../sqlite/sqlite.type';
import type { SQliteClient } from '../../sqlite/sqlite-client';
import { buildCleanDB } from '../../sqlite/sqlite-client.mock';
import type { MessageType } from '../message/message.type';

let client: SQliteClient;

beforeEach(async () => {
    client = await buildCleanDB();
});

describe('Message Thread Table', () => {
    test('we can create a message thread directly without any messages', async () => {
        const thread = await client.tables.messageThread.new();
        expect(thread).toBeDefined();
        expect(thread.id).toBeTypeOf('string');
        const retrievedThread = await client.tables.messageThread.ref(thread.id).get();
        expect(retrievedThread).toBeDefined();
        expect(retrievedThread.messagesData).toEqual([]);
    });

    test('we can get a message thread referance by id', async () => {
        const newThread = await client.tables.messageThread.new();
        const ref = client.tables.messageThread.ref(newThread.id);
        const retrievedThread = await ref.get();
        expect(retrievedThread).toBeDefined();
        expect(retrievedThread.id).toEqual(newThread.id);
    });
});

describe('Message Thread Record', () => {
    describe('we can add to a message thread', () => {
        test('we can add to a message thread with a partial message which create messages in the messages table', async () => {
            const thread = await client.tables.messageThread.new();
            const threadRef = client.tables.messageThread.ref(thread.id);
            const partialMessage: NewRecord<MessageType> = {
                type: 'text',
                senderId: 'user1',
                payloadData: { content: 'Hello' },
            };

            await threadRef.addMessagePartials(partialMessage);

            const messages = await threadRef.getAllMessages();
            expect(messages.length).toBe(1);
            expect((messages[0].payloadData as { content: string }).content).toBe('Hello');
            expect(messages[0].senderId).toBe('user1');
        });

        test('we can directly pass references to messages in the messages table', async () => {
            const thread = await client.tables.messageThread.new();
            const threadRef = client.tables.messageThread.ref(thread.id);
            const message1Data: NewRecord<MessageType> = {
                type: 'text',
                senderId: 'user1',
                payloadData: { content: 'Message 1' },
            };
            const message1 = await client.tables.message.create(message1Data);
            const messageRef1 = client.tables.message.ref(message1.id);

            await threadRef.addMessages(messageRef1);

            const messages = await threadRef.getAllMessages();
            expect(messages.length).toBe(1);
            expect(messages[0].id).toBe(message1.id);
            expect((messages[0].payloadData as { content: string }).content).toBe('Message 1');
        });
    });

    describe('we can read from the thread', () => {
        test('we can get all messages', async () => {
            const thread = await client.tables.messageThread.new();
            const threadRef = client.tables.messageThread.ref(thread.id);
            await threadRef.addMessagePartials(
                { type: 'text', senderId: 'user1', payloadData: { content: 'Msg1' } },
                { type: 'text', senderId: 'user2', payloadData: { content: 'Msg2' } }
            );

            const allMessages = await threadRef.getAllMessages();

            expect(allMessages.length).toBe(2);
            expect((allMessages[0].payloadData as { content: string }).content).toBe('Msg1');
            expect((allMessages[1].payloadData as { content: string }).content).toBe('Msg2');
        });

        test('we can group messages by sender id in turns', async () => {
            const thread = await client.tables.messageThread.new();
            const threadRef = client.tables.messageThread.ref(thread.id);
            await threadRef.addMessagePartials(
                { type: 'text', senderId: 'user1', payloadData: { content: 'U1M1' } },
                { type: 'text', senderId: 'user1', payloadData: { content: 'U1M2' } },
                { type: 'text', senderId: 'user2', payloadData: { content: 'U2M1' } },
                { type: 'text', senderId: 'user1', payloadData: { content: 'U1M3' } }
            );

            const turns = await threadRef.getTurns();

            expect(turns.length).toBe(3);
            expect(turns[0].senderId).toBe('user1');
            expect(turns[0].messages.length).toBe(2);
            if (turns[0].messages[0].type === 'text') {
                expect(turns[0].messages[0].payloadData.content).toBe('U1M1');
            } else {
                throw new Error('Expected text message');
            }
            if (turns[0].messages[1].type === 'text') {
                expect(turns[0].messages[1].payloadData.content).toBe('U1M2');
            } else {
                throw new Error('Expected text message');
            }
            expect(turns[1].senderId).toBe('user2');
            expect(turns[1].messages.length).toBe(1);
            if (turns[1].messages[0].type === 'text') {
                expect(turns[1].messages[0].payloadData.content).toBe('U2M1');
            } else {
                throw new Error('Expected text message');
            }
            expect(turns[2].senderId).toBe('user1');
            expect(turns[2].messages.length).toBe(1);
            if (turns[2].messages[0].type === 'text') {
                expect(turns[2].messages[0].payloadData.content).toBe('U1M3');
            } else {
                throw new Error('Expected text message');
            }
        });
    });

    describe('we can get metadata computed from the thread', () => {
        describe('we can get the active tool definitions in the thread', () => {
            test('when there have been no tool definitions added to the thread, we get an empty array', async () => {
                const thread = await client.tables.messageThread.new();
                const threadRef = client.tables.messageThread.ref(thread.id);
                const activeTools = await threadRef.getAllActiveToolDefinitions();
                expect(activeTools).toEqual([]);
            });

            test('when there have been tool definitions added to the thread, then removed, we get an empty array', async () => {
                const thread = await client.tables.messageThread.new();
                const threadRef = client.tables.messageThread.ref(thread.id);
                const toolDef1 = await client.tables.toolDefinition.newToolDefinition({
                    name: 'Tool 1',
                    description: 'Desc 1',
                    handlerType: 'abyss',
                    inputSchemaData: [],
                    outputSchemaData: [],
                });

                await threadRef.addMessagePartials(
                    {
                        type: 'new-tool-definition',
                        senderId: 'system',
                        payloadData: {
                            tools: [
                                {
                                    toolId: toolDef1.id,
                                    shortName: toolDef1.shortName,
                                    description: toolDef1.description,
                                    inputSchemaData: toolDef1.inputSchemaData,
                                    outputSchemaData: toolDef1.outputSchemaData,
                                },
                            ],
                        },
                    },
                    {
                        type: 'remove-tool-definition',
                        senderId: 'system',
                        payloadData: { tools: [toolDef1.id] },
                    }
                );

                const activeTools = await threadRef.getAllActiveToolDefinitions();
                expect(activeTools).toEqual([]);
            });

            test('when there are tool definitions that are not removed, we get the tool definitions', async () => {
                const thread = await client.tables.messageThread.new();
                const threadRef = client.tables.messageThread.ref(thread.id);
                const toolDef1 = await client.tables.toolDefinition.newToolDefinition({
                    name: 'Tool 1',
                    description: 'Desc 1',
                    handlerType: 'abyss',
                    inputSchemaData: [],
                    outputSchemaData: [],
                });
                const toolDef2 = await client.tables.toolDefinition.newToolDefinition({
                    name: 'Tool 2',
                    description: 'Desc 2',
                    handlerType: 'abyss',
                    inputSchemaData: [],
                    outputSchemaData: [],
                });

                await threadRef.addMessagePartials(
                    {
                        type: 'new-tool-definition',
                        senderId: 'system',
                        payloadData: {
                            tools: [
                                {
                                    toolId: toolDef1.id,
                                    shortName: toolDef1.shortName,
                                    description: toolDef1.description,
                                    inputSchemaData: toolDef1.inputSchemaData,
                                    outputSchemaData: toolDef1.outputSchemaData,
                                },
                                {
                                    toolId: toolDef2.id,
                                    shortName: toolDef2.shortName,
                                    description: toolDef2.description,
                                    inputSchemaData: toolDef2.inputSchemaData,
                                    outputSchemaData: toolDef2.outputSchemaData,
                                },
                            ],
                        },
                    },
                    {
                        type: 'remove-tool-definition',
                        senderId: 'system',
                        payloadData: { tools: [toolDef1.id] },
                    }
                );

                const activeTools = await threadRef.getAllActiveToolDefinitions();
                expect(activeTools.length).toBe(1);
                expect(activeTools[0].id).toBe(toolDef2.id);
            });
        });

        describe('we can get the delta tool definitions in the thread from its current list to the list we want to set it to', () => {
            test('when there have been no tool definitions added to the thread, we get the tool definitions we want to set it to', async () => {
                const thread = await client.tables.messageThread.new();
                const threadRef = client.tables.messageThread.ref(thread.id);
                const toolDef1 = await client.tables.toolDefinition.newToolDefinition({
                    name: 'Tool 1',
                    description: 'Desc 1',
                    handlerType: 'abyss',
                    inputSchemaData: [],
                    outputSchemaData: [],
                });
                const toolDefRef1 = client.tables.toolDefinition.ref(toolDef1.id);

                const delta = await threadRef.getDeltaToolDefinitions([toolDefRef1]);
                expect(delta.toolsToAdd.length).toBe(1);
                expect(delta.toolsToAdd[0].id).toBe(toolDef1.id);
                expect(delta.toolsToRemove.length).toBe(0);
            });

            test('when there have been tool definitions added to the thread, then removed, we get the tool definitions we want to set it to', async () => {
                const thread = await client.tables.messageThread.new();
                const threadRef = client.tables.messageThread.ref(thread.id);
                const toolDef1 = await client.tables.toolDefinition.newToolDefinition({
                    name: 'Tool 1',
                    description: 'Desc 1',
                    handlerType: 'abyss',
                    inputSchemaData: [],
                    outputSchemaData: [],
                });
                const toolDef2 = await client.tables.toolDefinition.newToolDefinition({
                    name: 'Tool 2',
                    description: 'Desc 2',
                    handlerType: 'abyss',
                    inputSchemaData: [],
                    outputSchemaData: [],
                });
                const toolDefRef2 = client.tables.toolDefinition.ref(toolDef2.id);

                await threadRef.addMessagePartials(
                    {
                        type: 'new-tool-definition',
                        senderId: 'system',
                        payloadData: {
                            tools: [
                                {
                                    toolId: toolDef1.id,
                                    shortName: toolDef1.shortName,
                                    description: toolDef1.description,
                                    inputSchemaData: toolDef1.inputSchemaData,
                                    outputSchemaData: toolDef1.outputSchemaData,
                                },
                            ],
                        },
                    },
                    {
                        type: 'remove-tool-definition',
                        senderId: 'system',
                        payloadData: { tools: [toolDef1.id] },
                    }
                );

                const delta = await threadRef.getDeltaToolDefinitions([toolDefRef2]);
                expect(delta.toolsToAdd.length).toBe(1);
                expect(delta.toolsToAdd[0].id).toBe(toolDef2.id);
                expect(delta.toolsToRemove.length).toBe(0);
            });

            test('when there have are tool definitions we also want to keep, we only get the additional tool definitions that are not already in the thread', async () => {
                const thread = await client.tables.messageThread.new();
                const threadRef = client.tables.messageThread.ref(thread.id);
                const toolDef1 = await client.tables.toolDefinition.newToolDefinition({
                    name: 'Tool 1',
                    description: 'Desc 1',
                    handlerType: 'abyss',
                    inputSchemaData: [],
                    outputSchemaData: [],
                });
                const toolDef2 = await client.tables.toolDefinition.newToolDefinition({
                    name: 'Tool 2',
                    description: 'Desc 2',
                    handlerType: 'abyss',
                    inputSchemaData: [],
                    outputSchemaData: [],
                });
                const toolDefRef1 = client.tables.toolDefinition.ref(toolDef1.id);
                const toolDefRef2 = client.tables.toolDefinition.ref(toolDef2.id);

                await threadRef.addMessagePartials({
                    type: 'new-tool-definition',
                    senderId: 'system',
                    payloadData: {
                        tools: [
                            {
                                toolId: toolDef1.id,
                                shortName: toolDef1.shortName,
                                description: toolDef1.description,
                                inputSchemaData: toolDef1.inputSchemaData,
                                outputSchemaData: toolDef1.outputSchemaData,
                            },
                        ],
                    },
                });

                const delta = await threadRef.getDeltaToolDefinitions([toolDefRef1, toolDefRef2]);
                expect(delta.toolsToAdd.length).toBe(1);
                expect(delta.toolsToAdd[0].id).toBe(toolDef2.id);
                expect(delta.toolsToRemove.length).toBe(0);
            });

            test('when there are tool definitions we dont want, we include those in the remove list', async () => {
                const thread = await client.tables.messageThread.new();
                const threadRef = client.tables.messageThread.ref(thread.id);
                const toolDef1 = await client.tables.toolDefinition.newToolDefinition({
                    name: 'Tool 1',
                    description: 'Desc 1',
                    handlerType: 'abyss',
                    inputSchemaData: [],
                    outputSchemaData: [],
                });
                const toolDef2 = await client.tables.toolDefinition.newToolDefinition({
                    name: 'Tool 2',
                    description: 'Desc 2',
                    handlerType: 'abyss',
                    inputSchemaData: [],
                    outputSchemaData: [],
                });
                const toolDefRef2 = client.tables.toolDefinition.ref(toolDef2.id);

                await threadRef.addMessagePartials({
                    type: 'new-tool-definition',
                    senderId: 'system',
                    payloadData: {
                        tools: [
                            {
                                toolId: toolDef1.id,
                                shortName: toolDef1.shortName,
                                description: toolDef1.description,
                                inputSchemaData: toolDef1.inputSchemaData,
                                outputSchemaData: toolDef1.outputSchemaData,
                            },
                        ],
                    },
                });

                const delta = await threadRef.getDeltaToolDefinitions([toolDefRef2]);
                expect(delta.toolsToAdd.length).toBe(1);
                expect(delta.toolsToAdd[0].id).toBe(toolDef2.id);
                expect(delta.toolsToRemove.length).toBe(1);
                expect(delta.toolsToRemove[0].id).toBe(toolDef1.id);
            });
        });

        describe('we can get the delta readonly documents in the thread from its current list to the list we want to set it to', () => {
            test('when there have been no readonly documents added to the thread, we get the readonly documents we want to set it to', async () => {
                const thread = await client.tables.messageThread.new();
                const threadRef = client.tables.messageThread.ref(thread.id);
                const docId1 = 'doc1';
                const docId2 = 'doc2';

                const missingDocuments = await threadRef.getDeltaReadonlyDocuments([docId1, docId2]);
                expect(missingDocuments.length).toBe(2);
                expect(missingDocuments).toContain(docId1);
                expect(missingDocuments).toContain(docId2);
            });

            test('when there are readonly documents we also want, we only get the additional readonly documents that are not already in the thread', async () => {
                const thread = await client.tables.messageThread.new();
                const threadRef = client.tables.messageThread.ref(thread.id);
                const docId1 = 'doc1';
                const docId2 = 'doc2';
                const docId3 = 'doc3';

                await threadRef.addMessagePartials({
                    type: 'readonly-document',
                    senderId: 'system',
                    payloadData: { documentIds: [docId1] },
                });

                const missingDocuments = await threadRef.getDeltaReadonlyDocuments([docId1, docId2, docId3]);
                expect(missingDocuments.length).toBe(2);
                expect(missingDocuments).toContain(docId2);
                expect(missingDocuments).toContain(docId3);
                expect(missingDocuments).not.toContain(docId1);
            });
        });

        describe('we can get the unprocessed tool calls in the thread', () => {
            test('when there have been no tool calls added to the thread, we get an empty array', async () => {
                const thread = await client.tables.messageThread.new();
                const threadRef = client.tables.messageThread.ref(thread.id);
                const unprocessedToolCalls = await threadRef.getUnprocessedToolCalls();
                expect(unprocessedToolCalls).toEqual({});
            });

            test('when there have been tool calls added to the thread, then completed, we get an empty array', async () => {
                const thread = await client.tables.messageThread.new();
                const threadRef = client.tables.messageThread.ref(thread.id);
                const toolDef1 = await client.tables.toolDefinition.newToolDefinition({
                    name: 'Tool 1',
                    description: 'Desc 1',
                    handlerType: 'abyss',
                    inputSchemaData: [],
                    outputSchemaData: [],
                });

                const toolCallRequest: NewRecord<MessageType> = {
                    type: 'tool-call-request',
                    senderId: 'ai',
                    payloadData: {
                        toolCallId: 'call1',
                        toolId: toolDef1.id,
                        shortName: toolDef1.shortName,
                        parameters: {},
                    },
                };
                const toolCallResponse: NewRecord<MessageType> = {
                    type: 'tool-call-response',
                    senderId: 'tool',
                    payloadData: {
                        toolCallId: 'call1',
                        shortName: toolDef1.shortName,
                        status: 'success',
                        result: 'result',
                    },
                };
                await threadRef.addMessagePartials(toolCallRequest, toolCallResponse);

                const unprocessedToolCalls = await threadRef.getUnprocessedToolCalls();
                expect(unprocessedToolCalls).toEqual({});
            });

            test('when there are tool calls that are not completed, we get the tool calls', async () => {
                const thread = await client.tables.messageThread.new();
                const threadRef = client.tables.messageThread.ref(thread.id);
                const toolDef1 = await client.tables.toolDefinition.newToolDefinition({
                    name: 'Tool 1',
                    description: 'Desc 1',
                    handlerType: 'abyss',
                    inputSchemaData: [],
                    outputSchemaData: [],
                });

                const toolCallRequest1Data: NewRecord<MessageType> = {
                    type: 'tool-call-request',
                    senderId: 'ai',
                    payloadData: {
                        toolCallId: 'call1',
                        toolId: toolDef1.id,
                        shortName: toolDef1.shortName,
                        parameters: {},
                    },
                };
                const createdMsg1 = await client.tables.message.create(toolCallRequest1Data);
                const msgRef1 = client.tables.message.ref(createdMsg1.id);

                const toolCallResponse1Data: NewRecord<MessageType> = {
                    type: 'tool-call-response',
                    senderId: 'tool',
                    payloadData: {
                        toolCallId: 'call1',
                        shortName: toolDef1.shortName,
                        status: 'success',
                        result: 'result',
                    },
                };
                const createdResponseMsg1 = await client.tables.message.create(toolCallResponse1Data);
                const responseRef1 = client.tables.message.ref(createdResponseMsg1.id);

                const toolCallRequest2Data: NewRecord<MessageType> = {
                    type: 'tool-call-request',
                    senderId: 'ai',
                    payloadData: {
                        toolCallId: 'call2',
                        toolId: toolDef1.id,
                        shortName: toolDef1.shortName,
                        parameters: {},
                    },
                };
                const createdMsg2 = await client.tables.message.create(toolCallRequest2Data);
                const msgRef2 = client.tables.message.ref(createdMsg2.id);

                await threadRef.addMessages(msgRef1, responseRef1, msgRef2);

                const unprocessedToolCalls = await threadRef.getUnprocessedToolCalls();
                expect(Object.keys(unprocessedToolCalls).length).toBe(1);
                expect(unprocessedToolCalls.call2).toBeDefined();
                expect(unprocessedToolCalls.call2.id).toBe(createdMsg2.id);
            });
        });
    });
});
