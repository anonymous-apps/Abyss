import { useDatabaseTableSubscription } from '../database-connection';

export function useStream(threadId: string) {
    const thread = useDatabaseTableSubscription(
        'MessageThread',
        async database => {
            return await database.table.messageThread.findById(threadId);
        },
        [threadId]
    );

    const stream = useDatabaseTableSubscription(
        'ResponseStream',
        async database => {
            return await database.table.responseStream.findById(thread.data?.lockingId || '');
        },
        [thread.data?.lockingId]
    );

    return {
        stream,
    };
}
