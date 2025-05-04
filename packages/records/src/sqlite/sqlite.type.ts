import { ReferencedAgentGraphTable } from '../records/agent-graph';
import { ReferencedAgentGraphExecutionTable } from '../records/agent-graph-execution';
import { ReferencedChatThreadTable } from '../records/chat-thread';
import { ReferencedMessageThreadTable } from '../records/message-thread';
import { ReferencedMetricTable } from '../records/metric';
import { ReferencedModelConnectionTable } from '../records/model-connection';
import { ReferencedSettingsTable } from '../records/settings';

export interface DBSidecarType {
    databaseVersionId: string;
    applicationVersionId: string;
}

export const DefaultSidecar: DBSidecarType = {
    databaseVersionId: 'NONE',
    applicationVersionId: 'NONE',
};

export interface BaseSqliteRecord {
    id: string;
    createdAt: number;
    updatedAt: number;
}

export interface SqliteTables {
    settings: ReferencedSettingsTable;
    modelConnection: ReferencedModelConnectionTable;
    agentGraph: ReferencedAgentGraphTable;
    agentGraphExecution: ReferencedAgentGraphExecutionTable;
    chatThread: ReferencedChatThreadTable;
    messageThread: ReferencedMessageThreadTable;
    metric: ReferencedMetricTable;
}
