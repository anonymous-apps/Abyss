import { DebugInputNode } from './debug-input';
import { DebugLogNode } from './debug-log';
import { InputLanguageModelNode } from './inputLanguageModel';
import { InvokeLanguageModelNode } from './InvokeLanguageModel';
import { OnChatMessageNode } from './onChatMessage';

export { DebugInputNode, DebugLogNode, InputLanguageModelNode, InvokeLanguageModelNode, OnChatMessageNode };

export const Nodes = {
    DebugLog: new DebugLogNode(),
    DebugInput: new DebugInputNode(),
    OnChatMessage: new OnChatMessageNode(),
    InputLanguageModel: new InputLanguageModelNode(),
    InvokeLanguageModel: new InvokeLanguageModelNode(),
};
