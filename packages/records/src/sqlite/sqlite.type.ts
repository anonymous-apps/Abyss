import type { ReferencedAgentGraphTable } from '../records/agent-graph/agent-graph';
import type { ReferencedChatSnapshotTable } from '../records/chat-snapshot/chat-snapshot';
import type { ReferencedChatThreadTable } from '../records/chat-thread/chat-thread';
import type { ReferencedDocumentTable } from '../records/document/document';
import type { ReferencedLogStreamTable } from '../records/logstream/logstream';
import type { ReferencedMessageThreadTable } from '../records/message-thread/message-thread';
import type { ReferencedMessageTable } from '../records/message/message';
import type { ReferencedMetricTable } from '../records/metric/metric';
import type { ReferencedModelConnectionTable } from '../records/model-connection/model-connection';
import type { ReferencedSettingsTable } from '../records/settings/settings';
import type { ReferencedToolDefinitionTable } from '../records/tool-definition/tool-definition';

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
    document: ReferencedDocumentTable;
    chatSnapshot: ReferencedChatSnapshotTable;
}
