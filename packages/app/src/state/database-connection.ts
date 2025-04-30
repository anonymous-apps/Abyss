import { PrismaConnection } from '@abyss/records';
import { TableReferences } from '@abyss/records/dist/prisma.type';
import { useEffect, useState } from 'react';
import { Database } from '../main';

function useStatefulQuery<T>(callback: (database: PrismaConnection) => Promise<T>) {
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

export function useDatabaseQuery<T>(callback: (database: PrismaConnection) => Promise<T>) {
    const query = useStatefulQuery(callback);

    useEffect(() => {
        const unsubscribe = Database.subscribeDatabase(data => {
            query.refetch();
        });
        return () => unsubscribe();
    }, []);

    return query;
}

export function useDatabaseTableQuery<T>(
    table: keyof TableReferences,
    callback: (database: PrismaConnection) => Promise<T>,
    listeners: any[] = []
) {
    const query = useStatefulQuery(callback);

    useEffect(() => {
        const unsubscribe = Database.subscribeTable(table, data => {
            query.refetch();
        });
        return () => unsubscribe();
    }, [table, callback]);

    useEffect(() => {
        query.refetch();
    }, listeners);

    return query;
}

export function useDatabaseRecord<T>(table: keyof TableReferences, recordId: string | undefined) {
    const [data, setData] = useState<T | null>(null);
    useEffect(() => {
        if (!recordId) {
            return;
        }
        const unsubscribe = Database.subscribeRecord(table, recordId, setData);
        return () => unsubscribe();
    }, [table, recordId]);

    return data;
}
