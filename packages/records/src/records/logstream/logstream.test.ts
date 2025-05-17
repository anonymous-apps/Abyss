import { beforeEach, describe, expect, test } from 'vitest';
import type { SQliteClient } from '../../sqlite/sqlite-client';
import { buildCleanDB } from '../../sqlite/sqlite-client.mock';
import type { ReferencedLogStreamRecord } from './logstream'; // Assuming ReferencedLogStreamRecord exists
import type { LogStreamType } from './logstream.type';

let client: SQliteClient;

beforeEach(async () => {
    client = await buildCleanDB();
});

describe('Logstream Table', () => {
    test('we can get a logstream referance by id', async () => {
        const newLogstreamRecord = await client.tables.logStream.new('test-type', 'test-source');
        const ref = client.tables.logStream.ref(newLogstreamRecord.id);
        const retrievedLogstream = await ref.get();
        expect(retrievedLogstream).toBeDefined();
        expect(retrievedLogstream.id).toEqual(newLogstreamRecord.id);
    });

    test('we can create a new logstream with a source type and source id', async () => {
        const sourceId = 'source-abc';
        const type = 'type-xyz';
        const logstreamRecord = await client.tables.logStream.new(type, sourceId); // Swapped order to type, sourceId as per method signature
        const logstream = await logstreamRecord.get();
        expect(logstream).toBeDefined();
        expect(logstream.id).toBeTypeOf('string');
        expect(logstream.sourceId).toEqual(sourceId);
        expect(logstream.type).toEqual(type);
        expect(logstream.status).toEqual('inProgress'); // Default status from .new()
        expect(logstream.messagesData).toEqual([]);
    });

    describe('scanning', () => {
        beforeEach(async () => {
            await client.tables.logStream.new('t1', 's1');
            await client.tables.logStream.new('t2', 's1');
            await client.tables.logStream.new('t1', 's2');
        });

        test('we can scan all logstreams by source id', async () => {
            const logstreams = await client.tables.logStream.scanBySourceId('s1');
            expect(logstreams.length).toBe(2);
            expect(logstreams.every((ls: LogStreamType) => ls.sourceId === 's1')).toBe(true);
        });

        test('we can scan all logstreams by source type', async () => {
            const logstreams = await client.tables.logStream.scanOfType('t1');
            expect(logstreams.length).toBe(2);
            expect(logstreams.every((ls: LogStreamType) => ls.type === 't1')).toBe(true);
        });
    });
});

describe('Logstream Record', () => {
    let logstreamRef: ReferencedLogStreamRecord;
    const testScope = 'test-scope';

    beforeEach(async () => {
        // .new() returns the record, so no need to call .get() immediately for the ref
        logstreamRef = await client.tables.logStream.new('record-test-type', 'record-test-source');
    });

    describe('Adding messages', () => {
        test('we can add log, warn, error, success, fail messages to a logstream', async () => {
            await logstreamRef.log(testScope, 'This is a log message');
            await logstreamRef.warn(testScope, 'This is a warning message');
            await logstreamRef.error(testScope, 'This is an error message', { custom: 'data' });

            const logstream = await logstreamRef.get();
            expect(logstream.messagesData.length).toBe(3);
            expect(logstream.messagesData[0].level).toBe('info');
            expect(logstream.messagesData[0].message).toBe('This is a log message');
            expect(logstream.messagesData[0].scope).toBe(testScope);
            expect(logstream.messagesData[1].level).toBe('warning');
            expect(logstream.messagesData[1].message).toBe('This is a warning message');
            expect(logstream.messagesData[1].scope).toBe(testScope);
            expect(logstream.messagesData[2].level).toBe('error');
            expect(logstream.messagesData[2].message).toBe('This is an error message');
            expect(logstream.messagesData[2].scope).toBe(testScope);
            expect(logstream.messagesData[2].data).toEqual({ custom: 'data' });
        });

        test('success messages will complete the logstream', async () => {
            const successMessage = 'Operation succeeded';
            await logstreamRef.log(testScope, successMessage); // Add message
            await logstreamRef.success(); // Then mark as success

            const logstream = await logstreamRef.get();
            expect(logstream.status).toBe('success');
            expect(logstream.completedAt).toBeTypeOf('number');
            expect(logstream.messagesData.length).toBe(1);
            expect(logstream.messagesData[0].level).toBe('info');
            expect(logstream.messagesData[0].message).toBe(successMessage);
        });

        test('fail messages will fail the logstream', async () => {
            const failMessage = 'Operation failed';
            const failData = { errorCode: 123 };
            await logstreamRef.error(testScope, failMessage, failData); // Add error message
            await logstreamRef.fail(); // Then mark as fail

            const logstream = await logstreamRef.get();
            expect(logstream.status).toBe('failed');
            expect(logstream.completedAt).toBeTypeOf('number');
            expect(logstream.messagesData.length).toBe(1);
            expect(logstream.messagesData[0].level).toBe('error');
            expect(logstream.messagesData[0].message).toBe(failMessage);
            expect(logstream.messagesData[0].data).toEqual(failData);
        });
    });
});
