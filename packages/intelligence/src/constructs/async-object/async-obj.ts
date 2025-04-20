import { AsyncObjectProps, AsyncObjectSubscriber } from './types';

/**
 * @description A class that manages an asynchronous object that can be updated and completed
 * @template T The type of data stored in the object
 */
export class AsyncObject<T> {
    private data: T;
    private isComplete: boolean;
    private subscribers: AsyncObjectSubscriber<T>[];

    constructor(props: AsyncObjectProps<T>) {
        this.data = props.initialData || ({} as T);
        this.isComplete = false;
        this.subscribers = [];
    }

    /**
     * @description Subscribe to the async object. Returns a promise that resolves when the object is completed.
     * @returns Promise that resolves with the final value
     */
    public subscribe(): Promise<T> {
        if (this.isComplete) {
            return Promise.resolve(this.data);
        }

        return new Promise<T>((resolve, reject) => {
            this.subscribers.push({ resolve, reject });
        });
    }

    /**
     * @description Get the current value of the object
     * @returns The current value
     */
    public getValue(): T {
        return this.data;
    }

    /**
     * @description Update the object with new data
     * @param newData The new data to update with
     * @throws Error if the object is already complete
     */
    public update(newData: T): void {
        if (this.isComplete) {
            throw new Error('Cannot update a completed async object');
        }
        this.data = newData;
    }

    /**
     * @description Complete the async object and resolve all subscribers
     * @param finalData Optional final data to set before completing
     */
    public dispatch(finalData?: T): void {
        if (this.isComplete) {
            return;
        }

        if (finalData !== undefined) {
            this.data = finalData;
        }

        this.isComplete = true;
        this.subscribers.forEach(subscriber => subscriber.resolve(this.data));
        this.subscribers = [];
    }

    /**
     * @description Check if the object is complete
     * @returns boolean indicating if the object is complete
     */
    public isCompleted(): boolean {
        return this.isComplete;
    }
}
