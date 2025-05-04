import { AgentGraphController } from './_records/agentGraph/agentGraph.controller';
import { AgentGraphExecutionController } from './_records/agentGraphExecution/agentGraphExecution.controller';
import { ChatThreadController } from './_records/chatThread/chatThread.controller';
import { MessageThreadController } from './_records/messageThread/messageThread.controller';
import { MetricController } from './_records/metric/metric.controller';
import { ModelConnectionController } from './_records/modelConnection/modelConnection.controller';
import { SettingsController } from './_records/settings/settings.controller';
import { TextDocumentController } from './_records/textDocument/textDocument.controller';
import { PrismaConnection } from './prisma';

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
