import { AgentGraphEdge, AgentGraphNode, PrismaConnection } from '@abyss/records';
import { describe, expect, it } from 'vitest';
import { Nodes, StateMachineExecution } from '../../state-machine';

describe('invokeGraph', () => {
    it('should invoke a graph', async () => {
        const db = new PrismaConnection();
        const modelConnection = await db.table.modelConnection.create({
            name: 'test',
            description: 'test',
            accessFormat: 'static',
            providerId: 'test',
            modelId: 'test',
            data: {
                response: 'test',
            },
        });

        const nodes: AgentGraphNode[] = [];
        const edges: AgentGraphEdge[] = [];

        const languageModel = Nodes.InputLanguageModel.getDefinition('inputChatModel');
        const onChatMessage = Nodes.OnChatMessage.getDefinition('onChatMessage');
        const invokeLanguageModel = Nodes.InvokeLanguageModel.getDefinition('invokeChatModel');
        const writeChatMessage = Nodes.WriteChatMessage.getDefinition('writeChatMessage');

        nodes.push({
            id: 'onChatMessage',
            nodeId: onChatMessage.type,
            position: { x: 0, y: 0 },
            parameters: {},
        });

        nodes.push({
            id: 'inputChatModel',
            nodeId: languageModel.type,
            position: { x: 0, y: 0 },
            parameters: {
                modelConnectionId: modelConnection.id,
            },
        });

        nodes.push({
            id: 'invokeChatModel',
            nodeId: invokeLanguageModel.type,
            position: { x: 0, y: 0 },
            parameters: {},
        });

        nodes.push({
            id: 'writeChatMessage',
            nodeId: writeChatMessage.type,
            position: { x: 0, y: 0 },
            parameters: {},
        });

        edges.push({
            id: 'onChatMessage-invoke-chat-model',
            sourceNodeId: onChatMessage.id,
            targetNodeId: invokeLanguageModel.id,
            sourcePortId: 'thread',
            targetPortId: 'thread',
        });

        edges.push({
            id: 'input-chat-model-to-invoke-chat-model',
            sourceNodeId: languageModel.id,
            targetNodeId: invokeLanguageModel.id,
            sourcePortId: 'chatModel',
            targetPortId: 'chatModel',
        });

        edges.push({
            id: 'invoke-chat-model-write-chat-message',
            sourceNodeId: invokeLanguageModel.id,
            targetNodeId: writeChatMessage.id,
            sourcePortId: 'rawResponse',
            targetPortId: 'message',
        });

        edges.push({
            id: 'write-chat-message-to-onChatMessage',
            sourceNodeId: onChatMessage.id,
            targetNodeId: writeChatMessage.id,
            sourcePortId: 'chat',
            targetPortId: 'chat',
        });

        const agentGraph = await db.table.agentGraph.create({
            name: 'test',
            description: 'test',
            nodes: nodes,
            edges: edges,
        });
        const chatRef = await db.table.chatThread.new(agentGraph.id);
        const chat = await chatRef.getOrThrow();
        const thread = await db.table.messageThread.getOrThrow(chat.threadId);
        const executionRecord = await db.table.agentGraphExecution.new(agentGraph.id);

        const execution = new StateMachineExecution(agentGraph, executionRecord, db);

        const result = await execution.invoke(
            'onChatMessage',
            [
                {
                    portId: 'thread',
                    inputValue: thread,
                    dataType: 'thread',
                },
                {
                    portId: 'chat',
                    inputValue: chat,
                    dataType: 'chat',
                },
            ],
            {
                type: 'onUserChat',
                chatId: chat.id,
            }
        );

        const events = await db.table.agentGraphExecution.get(executionRecord.id);
        const chatOutput = await db.table.chatThread.getOrThrow(chat.id);
        const threadOutput = await db.table.messageThread.getOrThrow(chatOutput.threadId);

        expect(threadOutput.turns[0].partials[0].payload).toEqual({
            content: 'test',
        });
    });
});
