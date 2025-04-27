import { AgentRecord } from '../../controllers/agent';
import { ChatRecord } from '../../controllers/chat';
import { MessageRecord } from '../../controllers/message';
import { ModelConnectionsRecord } from '../../controllers/model-connections';
import { MessageThreadRecord } from '../../controllers/thread';
import { ToolRecord } from '../../controllers/tool';

export interface AskRawModelToRespondToThreadInput {
    chat: ChatRecord;
    thread: MessageThreadRecord;
    messages: MessageRecord[];
    connection: ModelConnectionsRecord;
}

export interface AskAgentToRespondToThreadInput {
    chat: ChatRecord;
    thread: MessageThreadRecord;
    messages: MessageRecord[];
    connection: ModelConnectionsRecord;
    agent: AgentRecord;
    toolConnections: {
        tool: ToolRecord;
        permission: string;
    }[];
}
