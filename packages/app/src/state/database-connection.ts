import { SQliteClient, SqliteTables } from '@abyss/records';
import { ReferencedSqliteRecord } from '@abyss/records/dist/sqlite/reference-record';
import { useEffect, useState } from 'react';
import { Database } from '../main';

function useStatefulQuery<T>(callback: (database: SQliteClient) => Promise<T>) {
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

export function useDatabaseQuery<T>(callback: (database: SQliteClient) => Promise<T>) {
    const query = useStatefulQuery(callback);

    useEffect(() => {
        const unsubscribe = Database.subscribeDatabase(() => {
            query.refetch();
        });
        return () => unsubscribe();
    }, []);

    return query;
}

export function useDatabaseTableQuery<T>(
    table: keyof SqliteTables,
    callback: (database: SQliteClient) => Promise<T>,
    listeners: any[] = []
) {
    const query = useStatefulQuery(callback);

    useEffect(() => {
        const unsubscribe = Database.tables[table].subscribeTable(data => {
            query.refetch();
        });
        return () => unsubscribe();
    }, [table, callback]);

    useEffect(() => {
        query.refetch();
    }, listeners);

    return query;
}

export function useDatabaseRecord<T>(table: keyof SqliteTables, recordId: string | undefined) {
    const [data, setData] = useState<T | null>(null);
    useEffect(() => {
        if (!recordId) {
            return;
        }
        const unsubscribe = Database.tables[table].subscribeRecord(recordId, setData as (data: any) => void);
        return () => unsubscribe();
    }, [table, recordId]);

    return data;
}

export function useDatabaseRecordReference<T extends ReferencedSqliteRecord>(table: keyof SqliteTables, recordId: string | undefined) {
    const [data, setData] = useState<T | null>(null);
    useEffect(() => {
        if (!recordId) {
            return;
        }
        const unsubscribe = Database.tables[table].subscribeRecord(recordId, () =>
            setData(Database.tables[table].ref(recordId) as unknown as T)
        );
        return () => unsubscribe();
    }, [table, recordId]);

    return data;
}

export function useDatabaseRecordReferenceQuery<T extends ReferencedSqliteRecord, V>(
    table: keyof SqliteTables,
    recordId: string | undefined,
    query: (record: T) => Promise<V>
) {
    const [data, setData] = useState<V | null>(null);
    useEffect(() => {
        if (!recordId) {
            return;
        }
        const unsubscribe = Database.tables[table].subscribeRecord(recordId, () => {
            const ref = Database.tables[table].ref(recordId) as unknown as T;
            query(ref).then(setData);
        });
        return () => unsubscribe();
    }, [table, recordId]);

    return data;
}
