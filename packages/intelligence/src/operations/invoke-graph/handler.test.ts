import { AgentGraphEdge, AgentGraphNode, SQliteClient } from '@abyss/records';
import { describe, expect, it } from 'vitest';
import { Nodes, StateMachineExecution } from '../../state-machine';

describe('invokeGraph', () => {
    it('should invoke a graph', async () => {
        const db = new SQliteClient('.test');
        const modelConnection = await db.tables.modelConnection.create({
            name: 'test',
            description: 'test',
            accessFormat: 'static',
            providerId: 'test',
            modelId: 'test',
            connectionData: {
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

        const agentGraph = await db.tables.agentGraph.create({
            name: 'test',
            description: 'test',
            nodesData: nodes,
            edgesData: edges,
        });
        const chatRef = db.tables.chatThread.ref(agentGraph.id);
        const chat = await chatRef.get();
        const threadRef = db.tables.messageThread.ref(chat.threadId);
        const thread = await threadRef.get();
        const outputLogRef = await db.tables.logStream.new('graph-execution', agentGraph.id);
        const execution = new StateMachineExecution(agentGraph, outputLogRef, db);

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
                message: 'test',
            }
        );

        const chatOutput = await db.tables.chatThread.get(chat.id);
        const threadOutput = await db.tables.messageThread.get(chatOutput.threadId);
        const messageOutput = await db.tables.message.get(threadOutput.messagesData[0].id);
        expect(messageOutput.payloadData.content).toEqual('test');
    });
});
