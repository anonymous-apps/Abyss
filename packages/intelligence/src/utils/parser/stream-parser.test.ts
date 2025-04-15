import { describe, expect, it } from 'vitest';
import { AsyncStream, ChatThread } from '../../constructs';
import { TextMessage, ToolCallMessage } from '../../constructs/streamed-chat-response/chat-response.types';
import { MockedLanguageModel } from '../../models/language-model.mocked';
import { StreamParser } from './stream-parser';

const mockModel = new MockedLanguageModel(
    async thread => {
        return thread;
    },
    thread => {
        return new AsyncStream<string>();
    }
);

describe('StreamParser', () => {
    describe('Text Parsing', () => {
        it('[Happy] should parse plain text messages', async () => {
            // Create a stream
            const stream = new AsyncStream<string>();
            const parser = new StreamParser({ stream, model: mockModel, inputThread: new ChatThread() });

            // Send text to the stream
            stream.push('Hello, world!');
            stream.close();

            // Parse the stream
            await parser.parse();

            // Verify we got the right data
            const messages = parser.chatResponse.getMessages();
            expect(messages.length).toBe(1);
            expect(messages[0].type).toBe('text');
            expect((messages[0] as TextMessage).content).toBe('Hello, world!');
        });

        it('[Happy] should handle multiple text chunks', async () => {
            // Create a stream
            const stream = new AsyncStream<string>();
            const parser = new StreamParser({ stream, model: mockModel, inputThread: new ChatThread() });

            // Send text to the stream in chunks
            stream.push('Hello, ');
            stream.push('world!');
            stream.close();

            // Parse the stream
            await parser.parse();

            // Verify we got the right data
            const messages = parser.chatResponse.getMessages();
            expect(messages.length).toBe(1);
            expect(messages[0].type).toBe('text');
            expect((messages[0] as TextMessage).content).toBe('Hello, world!');
        });
    });

    describe('Tool Parsing', () => {
        it('[Happy] should parse tool calls', async () => {
            // Create a stream
            const stream = new AsyncStream<string>();
            const parser = new StreamParser({ stream, model: mockModel, inputThread: new ChatThread() });

            // Send text to the stream
            stream.push(`
                <tool1>
                    <data>
                        <name>John</name>
                    </data>
                </tool1>
            `);
            stream.close();

            // Parse the stream
            await parser.parse();

            // Verify we got the right data
            const messages = parser.chatResponse.getMessages();
            expect(messages.length).toBe(3);
            expect(messages[0].type).toBe('text');
            expect(messages[1].type).toBe('toolCall');
            expect(messages[2].type).toBe('text');
            expect((messages[1] as ToolCallMessage).name).toBe('tool1');
            expect((messages[1] as ToolCallMessage).args).toEqual({
                data: { name: 'John' },
            });
        });

        it('[Happy] should parse nested tool calls', async () => {
            // Create a stream
            const stream = new AsyncStream<string>();
            const parser = new StreamParser({ stream, model: mockModel, inputThread: new ChatThread() });

            // Send nested tool calls to the stream
            stream.push('<parent>');
            stream.push('<child>');
            stream.push('value1');
            stream.push('</child>');
            stream.push('</parent>');
            stream.close();

            // Parse the stream
            await parser.parse();

            // Verify we got the right data
            const messages = parser.chatResponse.getMessages();
            expect(messages.length).toBe(1);
            expect(messages[0].type).toBe('toolCall');
            expect((messages[0] as ToolCallMessage).name).toBe('parent');
            expect((messages[0] as ToolCallMessage).args).toEqual({
                child: 'value1',
            });
        });

        it('[Error] should throw error when tool call has no keys', async () => {
            // Create a stream
            const stream = new AsyncStream<string>();
            const parser = new StreamParser({ stream, model: mockModel, inputThread: new ChatThread() });

            // Send a tool call without keys to the stream
            stream.push('<tool>');
            stream.push('value1');
            stream.push('</tool>');
            stream.close();

            // Parse the stream and expect an error
            await expect(parser.parse()).rejects.toThrow('Tool calls must have keys. Direct data without keys is not allowed.');
        });
    });

    describe('CDATA Parsing', () => {
        it('[Happy] should parse CDATA sections', async () => {
            // Create a stream
            const stream = new AsyncStream<string>();
            const parser = new StreamParser({ stream, model: mockModel, inputThread: new ChatThread() });

            // Send a tool call with CDATA to the stream
            stream.push('<tool>');
            stream.push('<data>');
            stream.push('![CDATA[');
            stream.push('value1');
            stream.push(']]>');
            stream.push('</data>');
            stream.push('</tool>');
            stream.close();

            // Parse the stream
            await parser.parse();

            // Verify we got the right data
            const messages = parser.chatResponse.getMessages();
            expect(messages.length).toBe(1);
            expect(messages[0].type).toBe('toolCall');
            expect((messages[0] as ToolCallMessage).name).toBe('tool');
            expect((messages[0] as ToolCallMessage).args).toEqual({
                data: '![CDATA[value1]]>',
            });
        });
    });

    describe('Complex Parsing', () => {
        it('[Happy] should parse a complex message with text and tool calls', async () => {
            // Create a stream
            const stream = new AsyncStream<string>();
            const parser = new StreamParser({ stream, model: mockModel, inputThread: new ChatThread() });

            // Send a complex message to the stream
            stream.push('Here is a tool call: ');
            stream.push('<tool>');
            stream.push('<data>');
            stream.push('value1');
            stream.push('</data>');
            stream.push('</tool>');
            stream.push(' And more text.');
            stream.close();

            // Parse the stream
            await parser.parse();

            // Verify we got the right data
            const messages = parser.chatResponse.getMessages();
            expect(messages.length).toBe(3);

            // First message should be text
            expect(messages[0].type).toBe('text');
            expect((messages[0] as TextMessage).content).toBe('Here is a tool call: ');

            // Second message should be a tool call
            expect(messages[1].type).toBe('toolCall');
            expect((messages[1] as ToolCallMessage).name).toBe('tool');
            expect((messages[1] as ToolCallMessage).args).toEqual({
                data: 'value1',
            });

            // Third message should be text
            expect(messages[2].type).toBe('text');
            expect((messages[2] as TextMessage).content).toBe(' And more text.');
        });
    });

    describe('Edge Cases', () => {
        it('[Edge] should handle empty stream', async () => {
            // Create a stream
            const stream = new AsyncStream<string>();
            const parser = new StreamParser({ stream, model: mockModel, inputThread: new ChatThread() });

            // Close the stream without pushing anything
            stream.close();

            // Parse the stream
            await parser.parse();

            // Verify no messages were received
            const messages = parser.chatResponse.getMessages();
            expect(messages.length).toBe(0);
        });

        it('[Edge] should handle partial XML tags', async () => {
            // Create a stream
            const stream = new AsyncStream<string>();
            const parser = new StreamParser({ stream, model: mockModel, inputThread: new ChatThread() });

            // Push partial XML tags to the stream
            stream.push('<');
            stream.push('tool');
            stream.push('>');
            stream.push('<data>');
            stream.push('value1');
            stream.push('</data>');
            stream.push('</');
            stream.push('tool');
            stream.push('>');
            stream.close();

            // Parse the stream
            await parser.parse();

            // Verify the partial XML tags were processed correctly
            const messages = parser.chatResponse.getMessages();
            expect(messages.length).toBe(1);
            expect(messages[0].type).toBe('toolCall');
            expect((messages[0] as ToolCallMessage).name).toBe('tool');
            expect((messages[0] as ToolCallMessage).args).toEqual({
                data: 'value1',
            });
        });

        it('[Edge] should handle malformed XML', async () => {
            // Create a stream
            const stream = new AsyncStream<string>();
            const parser = new StreamParser({ stream, model: mockModel, inputThread: new ChatThread() });

            // Push malformed XML to the stream
            stream.push('<tool>');
            stream.push('<data>');
            stream.push('value1');
            // Missing closing tag
            stream.close();

            // Parse the stream
            await parser.parse();

            // Verify the malformed XML was handled gracefully
            const messages = parser.chatResponse.getMessages();
            expect(messages.length).toBe(1);
            expect(messages[0].type).toBe('toolCall');
            expect((messages[0] as ToolCallMessage).name).toBe('tool');
            expect((messages[0] as ToolCallMessage).args).toEqual({
                data: 'value1',
            });
        });
    });
});
