import { useState, useEffect } from 'react';
import { PrismaAPI } from '../../server/preload/database-connection';
import { Database } from '../main';

export function useDatabaseQuery<T>(callback: (database: PrismaAPI) => Promise<T>) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await callback(Database);
            if (result) {
                setData(result);
            }
        } catch (error) {
            setError(error as Error);
        } finally {
            setLoading(false);
        }
    };

    // Initial query
    useEffect(() => {
        fetchData();
    }, []);

    return { data, loading, error, refetch: fetchData };
}

export function useDatabaseTableSubscription<T>(table: string, callback: (database: PrismaAPI) => Promise<T>, listeners: any[] = []) {
    const query = useDatabaseQuery(callback);

    useEffect(() => {
        const subscriptionId = Database.subscribeTable(table, data => {
            query.refetch();
        });
        return () => Database.unsubscribeTable(table, subscriptionId);
    }, [table, callback]);

    useEffect(() => {
        query.refetch();
    }, listeners);

    return query;
}

export function useDatabaseRecordSubscription<T>(table: string, recordId: string, callback: (database: PrismaAPI) => Promise<T>) {
    const query = useDatabaseQuery(callback);

    useEffect(() => {
        const subscriptionId = Database.subscribeRecord(table, recordId, data => {
            query.refetch();
        });
        return () => Database.unsubscribeRecord(table, recordId, subscriptionId);
    }, [table, recordId]);

    return query;
}

export function useScanTableModelConnections() {
    return useDatabaseTableSubscription('ModelConnections', async database => database.table.modelConnections.scanTable());
}

export function useTableRecordModelConnections(id: string) {
    return useDatabaseRecordSubscription('ModelConnections', id, async database => database.table.modelConnections.findUnique(id));
}

export function useTableRecordUserSettings() {
    return useDatabaseTableSubscription('UserSettings', async database => database.table.userSettings.findFirst());
}

export function useScanTableMessageThread() {
    return useDatabaseTableSubscription('MessageThread', async database => database.table.messageThread.scanTable());
}

export function useTableRecordMessageThread(id: string) {
    return useDatabaseRecordSubscription('MessageThread', id, async database => database.table.messageThread.findUnique(id));
}

export function useScanTableMessage() {
    return useDatabaseTableSubscription('Message', async database => database.table.message.scanTable());
}

export function useTableRecordMessage(id: string) {
    return useDatabaseRecordSubscription('Message', id, async database => database.table.message.findUnique(id));
}

export function useScanTableNetworkCall() {
    return useDatabaseTableSubscription('NetworkCall', async database => database.table.networkCall.scanTable());
}

export function useTableRecordNetworkCall(id: string) {
    return useDatabaseRecordSubscription('NetworkCall', id, async database => database.table.networkCall.findUnique(id));
}

export function useScanTableRenderedConversationThread() {
    return useDatabaseTableSubscription('RenderedConversationThread', async database =>
        database.table.renderedConversationThread.scanTable()
    );
}

export function useTableRecordRenderedConversationThread(id: string) {
    return useDatabaseRecordSubscription('RenderedConversationThread', id, async database =>
        database.table.renderedConversationThread.findUnique(id)
    );
}

export function useScanTableChat() {
    return useDatabaseTableSubscription('Chat', async database => database.table.chat.scanTable());
}

export function useTableRecordChat(id: string) {
    return useDatabaseRecordSubscription('Chat', id, async database => database.table.chat.findUnique(id));
}

export function useScanTableAgent() {
    return useDatabaseTableSubscription('Agent', async database => database.table.agent.scanTable());
}

export function useTableRecordAgent(id: string) {
    return useDatabaseRecordSubscription('Agent', id, async database => database.table.agent.findUnique(id));
}

export function useScanTableAgentToolConnection() {
    return useDatabaseTableSubscription('AgentToolConnection', async database => database.table.agentToolConnection.scanTable());
}

export function useTableRecordAgentToolConnection(id: string) {
    return useDatabaseRecordSubscription('AgentToolConnection', id, async database => database.table.agentToolConnection.findUnique(id));
}

export function useScanTableTool() {
    return useDatabaseTableSubscription('Tool', async database => database.table.tool.scanTable());
}

export function useTableRecordTool(id: string) {
    return useDatabaseRecordSubscription('Tool', id, async database => database.table.tool.findUnique(id));
}

export function useScanTableToolInvocation() {
    return useDatabaseTableSubscription('ToolInvocation', async database => database.table.toolInvocation.scanTable());
}

export function useTableRecordToolInvocation(id: string) {
    return useDatabaseRecordSubscription('ToolInvocation', id, async database => database.table.toolInvocation.findUnique(id));
}

export function useScanTableJobs() {
    return useDatabaseTableSubscription('Jobs', async database => database.table.jobs.scanTable());
}

export function useTableRecordJobs(id: string) {
    return useDatabaseRecordSubscription('Jobs', id, async database => database.table.jobs.findUnique(id));
}

export function useScanTableMetric() {
    return useDatabaseTableSubscription('Metric', async database => database.table.metric.scanTable());
}

export function useTableRecordMetric(id: string) {
    return useDatabaseRecordSubscription('Metric', id, async database => database.table.metric.findUnique(id));
}

export function useScanTableTextLog() {
    return useDatabaseTableSubscription('TextLog', async database => database.table.textLog.scanTable());
}

export function useTableRecordTextLog(id: string) {
    return useDatabaseRecordSubscription('TextLog', id, async database => database.table.textLog.findUnique(id));
}
