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
