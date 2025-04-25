import { DebugInputNode } from './debug-input';
import { DebugLogNode } from './debug-log';
import { OnChatMessageNode } from './onChatMessage';

export { DebugInputNode, DebugLogNode, OnChatMessageNode };

export const Nodes = {
    DebugLog: new DebugLogNode(),
    DebugInput: new DebugInputNode(),
    OnChatMessage: new OnChatMessageNode(),
};
