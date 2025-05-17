import type { ReferencedAgentGraphTable } from '../records/agent-graph/agent-graph';
import type { ReferencedChatSnapshotTable } from '../records/chat-snapshot/chat-snapshot';
import type { ReferencedChatThreadTable } from '../records/chat-thread/chat-thread';
import type { ReferencedDocumentTable } from '../records/document/document';
import type { ReferencedLogStreamTable } from '../records/logstream/logstream';
import type { ReferencedMessageTable } from '../records/message/message';
import type { ReferencedMessageThreadTable } from '../records/message-thread/message-thread';
import type { ReferencedMetricTable } from '../records/metric/metric';
import type { ReferencedModelConnectionTable } from '../records/model-connection/model-connection';
import type { ReferencedSettingsTable } from '../records/settings/settings';
import type { ReferencedToolDefinitionTable } from '../records/tool-definition/tool-definition';
import type { ReferencedSqliteRecord } from './reference-record';
import type { SQliteClient } from './sqlite-client';

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

export type SqliteRecordClass<Ref = ReferencedSqliteRecord> = new (
    tableId: keyof SqliteTables,
    recordId: string,
    client: SQliteClient
) => Ref;

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
