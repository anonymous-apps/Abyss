import { describe, expect, it } from 'vitest';
import { AsyncStream } from './stream';

describe('stream', () => {
    describe('AsyncStream', () => {
        it('[Happy] should allow pushing and consuming values', async () => {
            const stream = new AsyncStream<number>();
            stream.push(1);
            stream.push(2);
            stream.push(3);
            stream.close();

            const result = await AsyncStream.all(stream);
            expect(result).toEqual([1, 2, 3]);
        });

        it('[Happy] should allow async iteration', async () => {
            const stream = new AsyncStream<string>();

            // Push values asynchronously
            setTimeout(() => {
                stream.push('a');
                stream.push('b');
                stream.push('c');
                stream.close();
            }, 0);

            const result: string[] = [];
            for await (const item of stream) {
                result.push(item);
            }

            expect(result).toEqual(['a', 'b', 'c']);
        });

        it('[Happy] should return the last value from the stream', async () => {
            const stream = new AsyncStream<string>();
            stream.push('a');
            stream.push('b');
            stream.push('c');
            stream.close();

            const result = await AsyncStream.last(stream);
            expect(result).toBe('c');
        });

        it('[Happy] should return undefined from last() for empty stream', async () => {
            const stream = new AsyncStream<string>();
            stream.close();

            const result = await AsyncStream.last(stream);
            expect(result).toBeUndefined();
        });

        it('[Happy] should handle immediate consumption', async () => {
            const stream = new AsyncStream<number>();
            const promise = stream.next();

            stream.push(42);

            const result = await promise;
            expect(result).toEqual({ value: 42, done: false });
        });

        it('[Happy] should handle delayed consumption', async () => {
            const stream = new AsyncStream<number>();
            stream.push(1);
            stream.push(2);

            const result1 = await stream.next();
            const result2 = await stream.next();

            expect(result1).toEqual({ value: 1, done: false });
            expect(result2).toEqual({ value: 2, done: false });
        });

        it('[Edge] should handle an empty stream', async () => {
            const stream = new AsyncStream<number>();
            stream.close();

            const result = await stream.next();
            expect(result).toEqual({ value: undefined, done: true });
        });

        it('[Edge] should return done after stream is closed', async () => {
            const stream = new AsyncStream<string>();
            stream.push('a');
            stream.close();

            const result1 = await stream.next();
            const result2 = await stream.next();

            expect(result1).toEqual({ value: 'a', done: false });
            expect(result2).toEqual({ value: undefined, done: true });
        });

        it('[Edge] should collect all values even when pushing after consumption starts', async () => {
            const stream = new AsyncStream<number>();

            // Start collecting all values
            const allPromise = AsyncStream.all(stream);

            // Push values after collection starts
            stream.push(1);
            stream.push(2);
            stream.push(3);
            stream.close();

            const result = await allPromise;
            expect(result).toEqual([1, 2, 3]);
        });

        it('[Unhappy] should throw error when pushing to a closed stream', () => {
            const stream = new AsyncStream<number>();
            stream.close();

            expect(() => stream.push(1)).toThrow('Cannot push to a closed stream');
        });

        it('[Unhappy] should propagate errors through the stream', async () => {
            const stream = new AsyncStream<number>();
            const error = new Error('Stream error');

            stream.setError(error);

            await expect(stream.next()).rejects.toThrow('Stream error');
            await expect(AsyncStream.all(stream)).rejects.toThrow('Stream error');
        });

        it('[Unhappy] should throw when multiple consumers wait on the stream', async () => {
            const stream = new AsyncStream<number>();

            // First waiter
            const promise1 = stream.next();

            // Second waiter should throw
            await expect(stream.next()).rejects.toThrow('Only one consumer can wait on the stream at a time');

            // Complete first waiter
            stream.push(1);
            await promise1;
        });
    });

    describe('waitForComplete', () => {
        it('[Happy] should return all values when stream is already complete', async () => {
            const stream = new AsyncStream<number>();
            stream.pushAll([1, 2, 3]);
            stream.close();

            const result = await stream.waitForComplete();
            expect(result).toEqual([1, 2, 3]);
        });

        it('[Happy] should wait for completion and return all values', async () => {
            const stream = new AsyncStream<number>();
            stream.push(1);
            stream.push(2);

            const completePromise = stream.waitForComplete();
            stream.push(3);
            stream.close();

            const result = await completePromise;
            expect(result).toEqual([1, 2, 3]);
        });

        it('[Happy] should allow multiple readers to wait for completion', async () => {
            const stream = new AsyncStream<number>();
            stream.push(1);

            const promise1 = stream.waitForComplete();
            const promise2 = stream.waitForComplete();

            stream.push(2);
            stream.close();

            const [result1, result2] = await Promise.all([promise1, promise2]);
            expect(result1).toEqual([1, 2]);
            expect(result2).toEqual([1, 2]);
        });

        it('[Happy] should maintain all data while allowing streaming consumption', async () => {
            const stream = new AsyncStream<number>();
            stream.push(1);
            stream.push(2);

            // Start streaming consumption
            const streamingPromise = (async () => {
                const results: number[] = [];
                for await (const item of stream) {
                    results.push(item);
                }
                return results;
            })();

            // Wait for completion in parallel
            const completePromise = stream.waitForComplete();

            stream.push(3);
            stream.close();

            const [streamingResult, completeResult] = await Promise.all([streamingPromise, completePromise]);
            expect(streamingResult).toEqual([1, 2, 3]);
            expect(completeResult).toEqual([1, 2, 3]);
        });

        it('[Unhappy] should throw error if stream is in error state', async () => {
            const stream = new AsyncStream<number>();
            const error = new Error('Test error');
            stream.setError(error);

            await expect(stream.waitForComplete()).rejects.toThrow(error);
        });

        it('[Edge] should return empty array for empty completed stream', async () => {
            const stream = new AsyncStream<number>();
            stream.close();

            const result = await stream.waitForComplete();
            expect(result).toEqual([]);
        });
    });
});
