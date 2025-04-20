import { describe, expect, it } from 'vitest';
import { AsyncObject } from './async-obj';

describe('AsyncObject', () => {
    describe('constructor', () => {
        it('[Happy] should initialize with empty object when no initial data provided', () => {
            const asyncObj = new AsyncObject({});
            expect(asyncObj.getValue()).toEqual({});
            expect(asyncObj.isCompleted()).toBe(false);
        });

        it('[Happy] should initialize with provided data', () => {
            const initialData = { foo: 'bar' };
            const asyncObj = new AsyncObject({ initialData });
            expect(asyncObj.getValue()).toEqual(initialData);
            expect(asyncObj.isCompleted()).toBe(false);
        });
    });

    describe('update', () => {
        it('[Happy] should update the object with new data', () => {
            const asyncObj = new AsyncObject({});
            const newData = { foo: 'bar' };
            asyncObj.update(newData);
            expect(asyncObj.getValue()).toEqual(newData);
        });

        it('[Unhappy] should throw error when updating completed object', () => {
            const asyncObj = new AsyncObject({});
            asyncObj.dispatch();
            expect(() => asyncObj.update({ foo: 'bar' })).toThrow('Cannot update a completed async object');
        });
    });

    describe('subscribe', () => {
        it('[Happy] should resolve immediately if object is already complete', async () => {
            const finalData = { foo: 'bar' };
            const asyncObj = new AsyncObject({});
            asyncObj.dispatch(finalData);

            const result = await asyncObj.subscribe();
            expect(result).toEqual(finalData);
        });

        it('[Happy] should resolve with final data when object is completed', async () => {
            const asyncObj = new AsyncObject({});
            const finalData = { foo: 'bar' };

            const subscribePromise = asyncObj.subscribe();
            asyncObj.dispatch(finalData);

            const result = await subscribePromise;
            expect(result).toEqual(finalData);
        });
    });

    describe('dispatch', () => {
        it('[Happy] should complete the object and resolve all subscribers', async () => {
            const asyncObj = new AsyncObject({});
            const finalData = { foo: 'bar' };

            const subscribePromise1 = asyncObj.subscribe();
            const subscribePromise2 = asyncObj.subscribe();

            asyncObj.dispatch(finalData);

            const [result1, result2] = await Promise.all([subscribePromise1, subscribePromise2]);
            expect(result1).toEqual(finalData);
            expect(result2).toEqual(finalData);
            expect(asyncObj.isCompleted()).toBe(true);
        });

        it('[Happy] should accept optional final data', async () => {
            const asyncObj = new AsyncObject({});
            const finalData = { foo: 'bar' };

            const subscribePromise = asyncObj.subscribe();
            asyncObj.dispatch(finalData);

            const result = await subscribePromise;
            expect(result).toEqual(finalData);
        });

        it('[Edge] should do nothing if already completed', () => {
            const asyncObj = new AsyncObject({});
            asyncObj.dispatch({ foo: 'bar' });
            const initialValue = asyncObj.getValue();

            asyncObj.dispatch({ foo: 'baz' });
            expect(asyncObj.getValue()).toEqual(initialValue);
        });
    });
});
