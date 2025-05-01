import { AgentGraphExecutionType, AgentGraphType, ChatThreadType, ModelConnectionType, SettingsType } from '@abyss/records';
import { TableReferences } from '@abyss/records/dist/prisma.type';
import { useDatabaseQuery, useDatabaseRecord, useDatabaseTableQuery } from './database-connection';

// General access

export function useDatabaseTableScan<T>(table: keyof TableReferences) {
    return useDatabaseTableQuery<T[]>(table, async database => database.table[table].scan() as unknown as Promise<T[]>);
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

export function useScanTableAgents() {
    return useDatabaseTableScan<AgentGraphType>('agentGraph');
}

export function useScanTableChats() {
    return useDatabaseTableScan<ChatThreadType>('chatThread');
}

export function useScanTableAgentExecutions() {
    return useDatabaseTableScan<AgentGraphExecutionType>('agentGraphExecution');
}
