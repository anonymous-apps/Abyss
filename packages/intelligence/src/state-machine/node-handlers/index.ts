import { NodeHandler } from '../node-handler';
import { InputLanguageModelNode } from './inputChatMode';
import { InvokeLanguageModelNode } from './InvokeChatModel';
import { OnChatMessageNode } from './onChatMessage';
import { WriteChatMessageNode } from './writeChatMessage';

export { InputLanguageModelNode, InvokeLanguageModelNode, NodeHandler, OnChatMessageNode, WriteChatMessageNode };
export const Nodes = {
    OnChatMessage: new OnChatMessageNode(),
    InputLanguageModel: new InputLanguageModelNode(),
    InvokeLanguageModel: new InvokeLanguageModelNode(),
    WriteChatMessage: new WriteChatMessageNode(),
};
