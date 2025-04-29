import { PrismaConnection } from './prisma';
import { AgentGraphController } from './records/agentGraph/agentGraph.controller';
import { AgentGraphExecutionController } from './records/agentGraphExecution/agentGraphExecution.controller';
import { ChatThreadController } from './records/chatThread/chatThread.controller';
import { MessageThreadController } from './records/messageThread/messageThread.controller';
import { MetricController } from './records/metric/metric.controller';
import { ModelConnectionController } from './records/modelConnection/modelConnection.controller';
import { SettingsController } from './records/settings/settings.controller';
import { TextDocumentController } from './records/textDocument/textDocument.controller';

export interface TableReferences {
    textDocument: TextDocumentController;
    modelConnection: ModelConnectionController;
    messageThread: MessageThreadController;
    chatThread: ChatThreadController;
    agentGraph: AgentGraphController;
    agentGraphExecution: AgentGraphExecutionController;
    metric: MetricController;
    settings: SettingsController;
}

export function buildTableReferences(connection: PrismaConnection): TableReferences {
    return {
        textDocument: new TextDocumentController(connection),
        modelConnection: new ModelConnectionController(connection),
        messageThread: new MessageThreadController(connection),
        chatThread: new ChatThreadController(connection),
        agentGraph: new AgentGraphController(connection),
        agentGraphExecution: new AgentGraphExecutionController(connection),
        metric: new MetricController(connection),
        settings: new SettingsController(connection),
    };
}
