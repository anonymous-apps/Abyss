import { describe, expect, it } from 'vitest';
import { Chat, Graph, Intelligence } from '../../constructs';
import { MockedDataInterface } from '../../constructs/data-interface.mock';
import { Nodes } from '../../state-machine';
import { GraphConnection } from '../../state-machine/graphs-objects/graph-connection';
import { invokeGraphHandler } from './handler';

describe('invokeGraph', () => {
    it('should invoke a graph', async () => {
        const db = new MockedDataInterface();

        const chat = await Chat.new(db);
        const graphObject = await Graph.new(db);
        const mockedModel = await Intelligence.new(db, {
            id: 'mocked-model',
            type: 'static',
            provider: 'mocked',
            modelId: 'mocked',
            data: {
                response: 'Hello, world!',
            },
        });

        const languageModel = Nodes.InputLanguageModel.getDefinition('inputChatModel');

        const onChatMessage = Nodes.OnChatMessage.getDefinition('onChatMessage');
        const invokeLanguageModel = Nodes.InvokeLanguageModel.getDefinition('invokeChatModel');
        const writeChatMessage = Nodes.WriteChatMessage.getDefinition('writeChatMessage');

        await graphObject.setNodeParameters(languageModel.id, {
            intelligenceId: mockedModel.id,
        });

        await graphObject.setNodes([onChatMessage, languageModel, invokeLanguageModel, writeChatMessage]);
        await graphObject.setConnections([
            new GraphConnection({
                id: 'onChatMessage-invoke-chat-model',
                sourceNodeId: onChatMessage.id,
                targetNodeId: invokeLanguageModel.id,
                sourcePortId: 'thread',
                targetPortId: 'thread',
            }),
            new GraphConnection({
                id: 'input-chat-model-to-invoke-chat-model',
                sourceNodeId: languageModel.id,
                targetNodeId: invokeLanguageModel.id,
                sourcePortId: 'chatModel',
                targetPortId: 'chatModel',
            }),
            new GraphConnection({
                id: 'invoke-chat-model-write-chat-message',
                sourceNodeId: invokeLanguageModel.id,
                targetNodeId: writeChatMessage.id,
                sourcePortId: 'rawResponse',
                targetPortId: 'message',
            }),
            new GraphConnection({
                id: 'write-chat-message-to-onChatMessage',
                sourceNodeId: onChatMessage.id,
                targetNodeId: writeChatMessage.id,
                sourcePortId: 'chat',
                targetPortId: 'chat',
            }),
        ]);

        await invokeGraphHandler({
            db,
            graphId: graphObject.id,
            input: {
                type: 'onUserChat',
                chatId: chat.id,
            },
        });

        const chatThread = await chat.getThread();
        expect(chatThread.getLastTurn().partials[0]).toEqual({
            text: {
                content: 'Hello, world!',
            },
            type: 'text',
        });
    });
});
