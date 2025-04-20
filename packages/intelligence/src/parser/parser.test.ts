// src/utils/parser/parser.test.ts
import { describe, expect, it, vi } from 'vitest';
import { TextMessage, ToolCallMessage } from './messages.types';
import { parseString } from './parser';

// Mock uuid
vi.mock('uuid', () => ({
    v4: () => 'mock-uuid',
}));

describe('parseString', () => {
    describe('Text Parsing', () => {
        it('[Happy] should parse plain text messages', () => {
            const input = 'Hello, world!';
            const messages = parseString(input);
            expect(messages.length).toBe(1);
            expect(messages[0]).toEqual({
                type: 'text',
                content: 'Hello, world!',
                uuid: 'mock-uuid',
            });
        });

        it('[Happy] should parse text with characters that look like tags', () => {
            const input = 'Less than < sign and > greater than.';
            const messages = parseString(input);
            // The parser treats this as 3 messages: "Less than ", "< sign and >", " greater than."
            expect(messages.length).toBe(3);
            expect(messages[0]).toMatchObject({
                type: 'text',
                content: 'Less than ',
            });
            expect(messages[1]).toMatchObject({
                type: 'text',
                content: '< sign and >',
            });
            expect(messages[2]).toMatchObject({
                type: 'text',
                content: ' greater than.',
            });
        });
    });

    describe('Tool Parsing', () => {
        it('[Happy] should parse simple tool calls', () => {
            const input = `<tool1><data><name>John</name></data></tool1>`;
            const messages = parseString(input);

            expect(messages.length).toBe(1);
            expect(messages[0].type).toBe('toolCall');
            expect((messages[0] as ToolCallMessage).name).toBe('tool1');
            expect((messages[0] as ToolCallMessage).args).toEqual({
                data: { name: 'John' },
            });
            expect(messages[0].uuid).toBe('mock-uuid');
        });

        it('[Happy] should parse tool calls with dashes in key names', () => {
            const input = `<my-tool><user-data><first-name>John</first-name><last-name>Doe</last-name></user-data></my-tool>`;
            const messages = parseString(input);

            expect(messages.length).toBe(1);
            expect(messages[0].type).toBe('toolCall');
            expect((messages[0] as ToolCallMessage).name).toBe('my-tool');
            expect((messages[0] as ToolCallMessage).args).toEqual({
                'user-data': {
                    'first-name': 'John',
                    'last-name': 'Doe',
                },
            });
            expect(messages[0].uuid).toBe('mock-uuid');
        });

        it('[Happy] should parse tool calls surrounded by whitespace', () => {
            // Note: The parser splits into text/tool/text
            const input = `
                <tool1>
                    <data>
                        <name>John</name>
                    </data>
                </tool1>
            `;
            const messages = parseString(input);

            expect(messages.length).toBe(3);
            expect(messages[0].type).toBe('text');
            expect((messages[0] as TextMessage).content).toMatch(/^\s+$/); // Whitespace
            expect(messages[1].type).toBe('toolCall');
            expect((messages[1] as ToolCallMessage).name).toBe('tool1');
            expect((messages[1] as ToolCallMessage).args).toEqual({
                data: { name: 'John' },
            });
            expect(messages[2].type).toBe('text');
            expect((messages[2] as TextMessage).content).toMatch(/^\s+$/); // Whitespace
        });

        it('[Happy] should parse nested tool calls', () => {
            const input = '<parent><child>value1</child></parent>';
            const messages = parseString(input);

            expect(messages.length).toBe(1);
            expect(messages[0].type).toBe('toolCall');
            expect((messages[0] as ToolCallMessage).name).toBe('parent');
            expect((messages[0] as ToolCallMessage).args).toEqual({
                child: 'value1',
            });
        });

        it('[Happy] should parse deeply nested tags', () => {
            const input = '<outer><middle><inner>value</inner></middle></outer>';
            const messages = parseString(input);
            expect(messages.length).toBe(1);
            expect(messages[0].type).toBe('toolCall');
            expect((messages[0] as ToolCallMessage).name).toBe('outer');
            expect((messages[0] as ToolCallMessage).args).toEqual({
                middle: { inner: 'value' },
            });
        });

        it('[Happy] should parse multiple keys at the same level', () => {
            const input = '<tool><key1>val1</key1><key2>val2</key2></tool>';
            const messages = parseString(input);
            expect(messages.length).toBe(1);
            expect(messages[0].type).toBe('toolCall');
            expect((messages[0] as ToolCallMessage).name).toBe('tool');
            expect((messages[0] as ToolCallMessage).args).toEqual({
                key1: 'val1',
                key2: 'val2',
            });
        });

        it('[Error] should throw error when tool call has direct text content', () => {
            const input = '<tool>value1</tool>';
            expect(() => parseString(input)).toThrow(
                'Tool <tool> must have keyed arguments (e.g., <key>value</key>). Direct text content "value1" is not allowed.'
            );
        });

        it('[Error] should throw error when tool call mixes text and tags', () => {
            const input = '<tool>text<key>value</key></tool>';
            expect(() => parseString(input)).toThrow(
                'Error parsing content of <tool>: Tool calls cannot have mixed content: text and tags found together inside a tag.'
            );
        });

        it('[Error] should throw error when tool call mixes tags and text', () => {
            const input = '<tool><key>value</key>text</tool>';
            expect(() => parseString(input)).toThrow(
                'Error parsing content of <tool>: Tool calls cannot have mixed content: text and tags found together inside a tag.'
            );
        });

        it('[Happy] should handle empty tool call content', () => {
            const input = '<tool></tool>';
            const messages = parseString(input);
            expect(messages.length).toBe(1);
            expect(messages[0].type).toBe('toolCall');
            expect((messages[0] as ToolCallMessage).name).toBe('tool');
            expect((messages[0] as ToolCallMessage).args).toEqual({});
        });

        it('[Happy] should handle tool call content with only whitespace', () => {
            const input = '<tool>  \n </tool>';
            const messages = parseString(input);
            expect(messages.length).toBe(1);
            expect(messages[0].type).toBe('toolCall');
            expect((messages[0] as ToolCallMessage).name).toBe('tool');
            expect((messages[0] as ToolCallMessage).args).toEqual({});
        });
    });

    describe('CDATA Parsing', () => {
        it('[Happy] should parse CDATA sections as string literals', () => {
            const input = '<tool><data><![CDATA[value1]]></data></tool>';
            const messages = parseString(input);

            expect(messages.length).toBe(1);
            expect(messages[0].type).toBe('toolCall');
            expect((messages[0] as ToolCallMessage).name).toBe('tool');
            // Expect content without CDATA wrapper
            expect((messages[0] as ToolCallMessage).args).toEqual({
                data: 'value1',
            });
        });

        it('[Happy] should parse CDATA with XML-like content', () => {
            const input = '<tool><script><![CDATA[if (a < b && c > d) { console.log("<hello>"); }]]></script></tool>';
            const messages = parseString(input);
            expect(messages.length).toBe(1);
            expect(messages[0].type).toBe('toolCall');
            expect((messages[0] as ToolCallMessage).name).toBe('tool');
            // Expect content without CDATA wrapper
            expect((messages[0] as ToolCallMessage).args).toEqual({
                script: 'if (a < b && c > d) { console.log("<hello>"); }',
            });
        });

        it('[Happy] should handle CDATA nested inside other tags', () => {
            const input = '<tool><outer><inner><![CDATA[content]]></inner></outer></tool>';
            const messages = parseString(input);
            expect(messages.length).toBe(1);
            expect(messages[0].type).toBe('toolCall');
            expect((messages[0] as ToolCallMessage).name).toBe('tool');
            // Expect content without CDATA wrapper
            expect((messages[0] as ToolCallMessage).args).toEqual({
                outer: { inner: 'content' },
            });
        });

        it('[Happy] should handle CDATA next to other tags', () => {
            const input = '<tool><data><![CDATA[cdata]]></data><value>text</value></tool>';
            const messages = parseString(input);
            expect(messages.length).toBe(1);
            expect(messages[0].type).toBe('toolCall');
            expect((messages[0] as ToolCallMessage).name).toBe('tool');
            // Expect content without CDATA wrapper
            expect((messages[0] as ToolCallMessage).args).toEqual({
                data: 'cdata',
                value: 'text',
            });
        });

        it('[Happy] should handle malformed CDATA (missing end)', () => {
            const input = '<tool><data><![CDATA[value</data></tool>';
            const messages = parseString(input);
            expect(messages.length).toBe(1);
            expect(messages[0].type).toBe('toolCall');
            expect((messages[0] as ToolCallMessage).name).toBe('tool');
            expect((messages[0] as ToolCallMessage).args).toEqual({
                data: '<![CDATA[value', // The content is treated as text because CDATA is malformed
            });
        });
    });

    describe('Complex Parsing', () => {
        it('[Happy] should parse a complex message with text and tool calls', () => {
            const input = 'Here is a tool call: <tool><data>value1</data></tool> And more text.';
            const messages = parseString(input);

            expect(messages.length).toBe(3);

            expect(messages[0].type).toBe('text');
            expect((messages[0] as TextMessage).content).toBe('Here is a tool call: ');

            expect(messages[1].type).toBe('toolCall');
            expect((messages[1] as ToolCallMessage).name).toBe('tool');
            expect((messages[1] as ToolCallMessage).args).toEqual({ data: 'value1' });

            expect(messages[2].type).toBe('text');
            expect((messages[2] as TextMessage).content).toBe(' And more text.');
        });

        it('[Happy] should parse multiple tool calls and text', () => {
            const input = 'Text1<tool1><k>v</k></tool1>Text2<tool2><k2>v2</k2></tool2>Text3';
            const messages = parseString(input);

            expect(messages.length).toBe(5);
            expect(messages[0]).toMatchObject({ type: 'text', content: 'Text1' });
            expect(messages[1]).toMatchObject({ type: 'toolCall', name: 'tool1', args: { k: 'v' } });
            expect(messages[2]).toMatchObject({ type: 'text', content: 'Text2' });
            expect(messages[3]).toMatchObject({ type: 'toolCall', name: 'tool2', args: { k2: 'v2' } });
            expect(messages[4]).toMatchObject({ type: 'text', content: 'Text3' });
        });
    });

    describe('Edge Cases', () => {
        it('[Edge] should handle empty string input', () => {
            const input = '';
            const messages = parseString(input);
            expect(messages.length).toBe(0);
        });

        it('[Edge] should handle input with only whitespace', () => {
            const input = '   \n\t   ';
            const messages = parseString(input);
            expect(messages.length).toBe(1); // Should produce a single text message with the whitespace
            expect(messages[0]).toMatchObject({ type: 'text', content: '   \n\t   ' });
        });

        it('[Edge] should handle malformed XML (missing closing tag)', () => {
            // Expected: [ TextMessage('<tool>'), TextMessage('<data>'), TextMessage('value1') ]
            const input = '<tool><data>value1';
            const messages = parseString(input);
            expect(messages.length).toBe(3);
            expect(messages[0]).toMatchObject({ type: 'text', content: '<tool>' });
            expect(messages[1]).toMatchObject({ type: 'text', content: '<data>' });
            expect(messages[2]).toMatchObject({ type: 'text', content: 'value1' });
        });

        it('[Edge] should handle malformed XML (missing closing >)', () => {
            const input = '<tool';
            const messages = parseString(input);
            expect(messages.length).toBe(1);
            expect(messages[0]).toMatchObject({ type: 'text', content: '<tool' });
        });

        it('[Edge] should handle malformed XML (missing opening tag)', () => {
            const input = 'text</tool>';
            const messages = parseString(input);
            expect(messages.length).toBe(2);
            expect(messages[0]).toMatchObject({ type: 'text', content: 'text' });
            expect(messages[1]).toMatchObject({ type: 'text', content: '</tool>' });
        });

        it('[Edge] should handle malformed XML (mismatched tags case 1)', () => {
            const input = '<tool><data>value</data></tool1>';
            // Expect error because <data>value is parsed as a tool call where <data> has direct text value
            expect(() => parseString(input)).toThrow(
                'Tool <data> must have keyed arguments (e.g., <key>value</key>). Direct text content "value" is not allowed.'
            );
        });

        it('[Edge] should handle malformed XML (mismatched tags case 2)', () => {
            const input = '<tool>value</tool1>';
            const messages = parseString(input);
            // The parser treats this as 3 messages: "<tool>", "value", "</tool1>"
            expect(messages.length).toBe(3);
            expect(messages[0]).toMatchObject({ type: 'text', content: '<tool>' });
            expect(messages[1]).toMatchObject({ type: 'text', content: 'value' });
            expect(messages[2]).toMatchObject({ type: 'text', content: '</tool1>' });
        });

        it('[Edge] should handle self-closing tags as text', () => {
            const input = 'Text <br/> more text.';
            const messages = parseString(input);
            expect(messages.length).toBe(3);
            expect(messages[0]).toMatchObject({ type: 'text', content: 'Text ' });
            expect(messages[1]).toMatchObject({ type: 'text', content: '<br/>' }); // Treated as text
            expect(messages[2]).toMatchObject({ type: 'text', content: ' more text.' });
        });

        it('[Edge] should handle XML declaration or comments as text', () => {
            const input = '<?xml version="1.0"?><!-- comment --><root><data>v</data></root>';
            const messages = parseString(input);
            expect(messages.length).toBe(3);
            expect(messages[0]).toMatchObject({ type: 'text', content: '<?xml version="1.0"?>' });
            expect(messages[1]).toMatchObject({ type: 'text', content: '<!-- comment -->' });
            expect(messages[2]).toMatchObject({ type: 'toolCall', name: 'root', args: { data: 'v' } });
        });
    });
});
