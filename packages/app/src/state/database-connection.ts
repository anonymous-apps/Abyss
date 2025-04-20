import { useEffect, useState } from 'react';
import { PrismaAPI } from '../../server/preload/database-connection';
import { Database } from '../main';

export function useDatabaseQuery<T>(callback: (database: PrismaAPI) => Promise<T>) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
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

export function useDatabaseRecordSubscription<T>(
    table: string,
    recordId: string | undefined,
    callback: (database: PrismaAPI) => Promise<T>
) {
    const query = useDatabaseQuery(callback);

    useEffect(() => {
        if (!recordId) {
            return;
        }
        query.refetch();
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

export function useTableRecordModelConnections(id: string | undefined) {
    return useDatabaseRecordSubscription('ModelConnections', id, async database => database.table.modelConnections.findById(id));
}

export function useTableRecordUserSettings() {
    return useDatabaseTableSubscription('UserSettings', async database => database.table.userSettings.findFirst());
}

export function useScanTableMessageThread() {
    return useDatabaseTableSubscription('MessageThread', async database => database.table.messageThread.scanTable());
}

export function useTableRecordMessageThread(id: string | undefined) {
    return useDatabaseRecordSubscription('MessageThread', id, async database => database.table.messageThread.findById(id));
}

export function useScanTableMessage() {
    return useDatabaseTableSubscription('Message', async database => database.table.message.scanTable());
}

export function useTableRecordMessage(id: string | undefined) {
    return useDatabaseRecordSubscription('Message', id, async database => database.table.message.findById(id));
}

export function useScanTableRenderedConversationThread() {
    return useDatabaseTableSubscription('RenderedConversationThread', async database =>
        database.table.renderedConversationThread.scanTable()
    );
}

export function useTableRecordRenderedConversationThread(id: string | undefined) {
    return useDatabaseRecordSubscription('RenderedConversationThread', id, async database =>
        database.table.renderedConversationThread.findById(id)
    );
}

export function useScanTableChat() {
    return useDatabaseTableSubscription('Chat', async database => database.table.chat.scanTable());
}

export function useTableRecordChat(id: string | undefined) {
    return useDatabaseRecordSubscription('Chat', id, async database => database.table.chat.findById(id));
}

export function useScanTableAgent() {
    return useDatabaseTableSubscription('Agent', async database => database.table.agent.scanTable());
}

export function useTableRecordAgent(id: string | undefined) {
    return useDatabaseRecordSubscription('Agent', id, async database => database.table.agent.findById(id));
}

export function useScanTableAgentToolConnection() {
    return useDatabaseTableSubscription('AgentToolConnection', async database => database.table.agentToolConnection.scanTable());
}

export function useTableRecordAgentToolConnection(id: string | undefined) {
    return useDatabaseRecordSubscription('AgentToolConnection', id, async database => database.table.agentToolConnection.findById(id));
}

export function useScanTableTool() {
    return useDatabaseTableSubscription('Tool', async database => database.table.tool.scanTable());
}

export function useTableRecordTool(id: string | undefined) {
    return useDatabaseRecordSubscription('Tool', id, async database => database.table.tool.findById(id));
}

export function useScanTableToolInvocation() {
    return useDatabaseTableSubscription('ToolInvocation', async database => database.table.toolInvocation.scanTable());
}

export function useTableRecordToolInvocation(id: string | undefined) {
    return useDatabaseRecordSubscription('ToolInvocation', id, async database => database.table.toolInvocation.findById(id));
}

export function useScanTableMetric() {
    return useDatabaseTableSubscription('Metric', async database => database.table.metric.scanTable());
}

export function useTableRecordMetric(id: string | undefined) {
    return useDatabaseRecordSubscription('Metric', id, async database => database.table.metric.findById(id));
}

export function useScanTableTextLog() {
    return useDatabaseTableSubscription('TextLog', async database => database.table.textLog.scanTable());
}

export function useTableRecordTextLog(id: string | undefined) {
    return useDatabaseRecordSubscription('TextLog', id, async database => database.table.textLog.findById(id));
}

export function useScanTablePrompt() {
    return useDatabaseTableSubscription('Prompt', async database => database.table.prompt.scanTable());
}

export function useTableRecordPrompt(id: string | undefined) {
    return useDatabaseRecordSubscription('Prompt', id, async database => database.table.prompt.findById(id));
}
