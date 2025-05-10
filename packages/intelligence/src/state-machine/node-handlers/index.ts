import { NodeHandler } from '../node-handler';
import { AddToolsToThreadNode } from './addToolsToChat';
import { InputLanguageModelNode } from './inputChatMode';
import { InputConstantStringNode } from './inputConstantString';
import { InputToolsSelectionNode } from './inputTools';
import { InvokeLanguageModelNode } from './InvokeChatModel';
import { OnChatMessageNode } from './onChatMessage';
import { WriteAgentMessageNode } from './writeAgentMessage';
import { WriteUserMessageNode } from './writeUserMessage';

export { InputLanguageModelNode, InvokeLanguageModelNode, NodeHandler, OnChatMessageNode, WriteAgentMessageNode as WriteChatMessageNode };
export const Nodes = {
    OnChatMessage: new OnChatMessageNode(),
    InputLanguageModel: new InputLanguageModelNode(),
    InvokeLanguageModel: new InvokeLanguageModelNode(),
    WriteAgentMessage: new WriteAgentMessageNode(),
    InputConstantString: new InputConstantStringNode(),
    WriteUserMessage: new WriteUserMessageNode(),
    InputToolsSelection: new InputToolsSelectionNode(),
    AddToolsToThread: new AddToolsToThreadNode(),
};
