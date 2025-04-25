import { DebugInputNode } from './debug-input';
import { DebugLogNode } from './debug-log';
import { InputLanguageModelNode } from './inputLanguageModel';
import { InvokeLanguageModelNode } from './InvokeLanguageModel';
import { OnChatMessageNode } from './onChatMessage';
import { WriteChatMessageNode } from './writeChatMessage';

export { DebugInputNode, DebugLogNode, InputLanguageModelNode, InvokeLanguageModelNode, OnChatMessageNode, WriteChatMessageNode };

export const Nodes = {
    DebugLog: new DebugLogNode(),
    DebugInput: new DebugInputNode(),
    OnChatMessage: new OnChatMessageNode(),
    InputLanguageModel: new InputLanguageModelNode(),
    InvokeLanguageModel: new InvokeLanguageModelNode(),
    WriteChatMessage: new WriteChatMessageNode(),
};
