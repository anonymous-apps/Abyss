import { PrismaConnection } from './prisma';
import { AgentGraphController } from './records/agentGraph/agentGraph.controller';
import { ChatThreadController } from './records/chatThread/chatThread.controller';
import { MessageThreadController } from './records/messageThread/messageThread.controller';
import { ModelConnectionController } from './records/modelConnection/modelConnection.controller';
import { TextDocumentController } from './records/textDocument/textDocument.controller';

export interface TableReferences {
    textDocument: TextDocumentController;
    modelConnection: ModelConnectionController;
    messageThread: MessageThreadController;
    chatThread: ChatThreadController;
    agentGraph: AgentGraphController;
}

export function buildTableReferences(connection: PrismaConnection): TableReferences {
    return {
        textDocument: new TextDocumentController(connection),
        modelConnection: new ModelConnectionController(connection),
        messageThread: new MessageThreadController(connection),
        chatThread: new ChatThreadController(connection),
        agentGraph: new AgentGraphController(connection),
    };
}
