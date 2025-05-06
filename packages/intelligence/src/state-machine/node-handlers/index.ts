import { NodeHandler } from '../node-handler';
import { InputLanguageModelNode } from './inputChatMode';
import { InputConstantStringNode } from './inputConstantString';
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
};
