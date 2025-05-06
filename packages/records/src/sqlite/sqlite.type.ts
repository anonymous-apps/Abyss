import { ReferencedAgentGraphTable } from '../records/agent-graph/agent-graph';
import { ReferencedChatThreadTable } from '../records/chat-thread/chat-thread';
import { ReferencedLogStreamTable } from '../records/logstream/logstream';
import { ReferencedMessageThreadTable } from '../records/message-thread/message-thread';
import { ReferencedMessageTable } from '../records/message/message';
import { ReferencedMetricTable } from '../records/metric/metric';
import { ReferencedModelConnectionTable } from '../records/model-connection/model-connection';
import { ReferencedSettingsTable } from '../records/settings/settings';
import { ReferencedToolDefinitionTable } from '../records/tool-definition/tool-definition';

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

export type NewRecord<T extends BaseSqliteRecord> = Omit<T, 'id' | 'createdAt' | 'updatedAt'> & { id?: string };

export interface SqliteTables {
    settings: ReferencedSettingsTable;
    modelConnection: ReferencedModelConnectionTable;
    agentGraph: ReferencedAgentGraphTable;
    chatThread: ReferencedChatThreadTable;
    messageThread: ReferencedMessageThreadTable;
    metric: ReferencedMetricTable;
    message: ReferencedMessageTable;
    logStream: ReferencedLogStreamTable;
    toolDefinition: ReferencedToolDefinitionTable;
}
