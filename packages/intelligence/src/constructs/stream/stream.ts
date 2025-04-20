export class AsyncStream<T> implements AsyncIterable<T> {
    private buffer: T[] = [];
    private allData: T[] = [];
    private waiter: ((value: IteratorResult<T>) => void) | null = null;
    private completionWaiters: ((value: T[]) => void)[] = [];
    private done = false;
    private error: Error | null = null;

    /**
     * Push multiple values into the stream at once
     *
     * @param values An array of values to push into the stream
     */
    pushAll(values: T[]): void {
        if (this.done) {
            throw new Error('Cannot push to a closed stream');
        }

        if (this.error) {
            throw this.error;
        }

        this.buffer.push(...values);
        this.allData.push(...values);
        this.notifyWaiter();
        this.notifyCompletionWaiters();
    }

    /**
     * Push a new value into the stream
     */
    push(value: T): void {
        if (this.done) {
            throw new Error('Cannot push to a closed stream');
        }

        if (this.error) {
            throw this.error;
        }

        this.buffer.push(value);
        this.allData.push(value);
        this.notifyWaiter();
        this.notifyCompletionWaiters();
    }

    /**
     * Close the stream, signaling no more values will be pushed
     */
    close(): void {
        this.done = true;
        this.notifyWaiter();
        this.notifyCompletionWaiters();
    }

    /**
     * Put the stream in an error state
     * Any future operations will throw this error
     */
    setError(error: Error): void {
        this.error = error;
        this.notifyWaiter();
        this.notifyCompletionWaiters();
    }

    /**
     * Get the next value from the stream
     */
    async next(): Promise<IteratorResult<T>> {
        if (this.error) {
            throw this.error;
        }

        if (this.buffer.length > 0) {
            return { value: this.buffer.shift()!, done: false };
        }

        if (this.done) {
            return { value: undefined as any, done: true };
        }

        if (this.waiter !== null) {
            throw new Error('Only one consumer can wait on the stream at a time');
        }

        return new Promise<IteratorResult<T>>(resolve => {
            this.waiter = resolve;
        });
    }

    /**
     * Wait for the stream to complete and return all values as an array
     * Multiple readers can wait for completion simultaneously
     * @returns Promise that resolves with an array of all values when the stream completes
     */
    public waitForComplete(): Promise<T[]> {
        if (this.error) {
            return Promise.reject(this.error);
        }

        if (this.done) {
            return Promise.resolve([...this.allData]);
        }

        return new Promise<T[]>(resolve => {
            this.completionWaiters.push(resolve);
        });
    }

    /**
     * Create an async iterator for this stream
     */
    [Symbol.asyncIterator](): AsyncIterator<T> {
        return {
            next: () => this.next(),
        };
    }

    /**
     * Notify waiter when new data is available or the stream is closed
     */
    private notifyWaiter(): void {
        if (this.waiter) {
            const currentWaiter = this.waiter;
            this.waiter = null;

            if (this.error) {
                // Reject with error
                setTimeout(() => {
                    throw this.error;
                }, 0);
            } else if (this.buffer.length > 0) {
                currentWaiter({ value: this.buffer.shift()!, done: false });
            } else if (this.done) {
                currentWaiter({ value: undefined as any, done: true });
            }
        }
    }

    /**
     * Notify all completion waiters when the stream is done or has an error
     */
    private notifyCompletionWaiters(): void {
        if (this.done || this.error) {
            const waiters = this.completionWaiters;
            this.completionWaiters = [];
            const data = [...this.allData];

            waiters.forEach(waiter => {
                if (this.error) {
                    setTimeout(() => {
                        throw this.error;
                    }, 0);
                } else {
                    waiter(data);
                }
            });
        }
    }

    /**
     * Collect all values from the stream into an array
     */
    static async all<T>(stream: AsyncStream<T>): Promise<T[]> {
        const results: T[] = [];
        for await (const item of stream) {
            results.push(item);
        }
        return results;
    }

    /**
     * Get the last value from the stream
     * Returns undefined if the stream is empty
     */
    static async last<T>(stream: AsyncStream<T>): Promise<T | undefined> {
        let lastItem: T | undefined = undefined;
        for await (const item of stream) {
            lastItem = item;
        }
        return lastItem;
    }
}
