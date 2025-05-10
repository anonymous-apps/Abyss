import {
    AgentGraphType,
    ChatThreadType,
    LogStreamType,
    ModelConnectionType,
    SettingsType,
    SqliteTables,
    ToolDefinitionType,
} from '@abyss/records';
import { useDatabaseQuery, useDatabaseRecord, useDatabaseTableQuery } from './database-connection';

// General access

export function useDatabaseTableScan<T>(table: keyof SqliteTables) {
    return useDatabaseTableQuery<T[]>(table, async database => database.tables[table].list() as unknown as Promise<T[]>);
}

export function useDatabaseTables() {
    return useDatabaseQuery(async database => database.describeTables());
}

export function useDatabaseSettings() {
    return useDatabaseRecord<SettingsType>('settings', 'settings::default');
}

// Specific access

export function useScanTableModelConnections() {
    return useDatabaseTableScan<ModelConnectionType>('modelConnection');
}

export function useScanTableToolDefinitions() {
    return useDatabaseTableScan<ToolDefinitionType>('toolDefinition');
}

export function useScanTableAgents() {
    return useDatabaseTableScan<AgentGraphType>('agentGraph');
}

export function useScanTableChats() {
    return useDatabaseTableScan<ChatThreadType>('chatThread');
}

export function useScanLogOfType(type: string) {
    return useDatabaseTableQuery<LogStreamType[]>('logStream', async database => database.tables.logStream.scanOfType(type));
}

export function useScanLogs() {
    return useDatabaseTableScan<LogStreamType>('logStream');
}

export function useScanTableTools() {
    return useDatabaseTableScan<ToolDefinitionType>('toolDefinition');
}
