import { parseOutSimpleXml } from '../../src/utils/xml-parser';

describe('XML Parser', () => {
    test('parses simple XML with single tag', () => {
        const input = '<name>John</name>';
        const result = parseOutSimpleXml(input);
        expect(result).toEqual([{ name: 'John' }]);
    });

    test('parses XML with nested tags', () => {
        const input = '<person><name>John</name><age>30</age></person>';
        const result = parseOutSimpleXml(input);
        expect(result).toEqual([
            {
                person: {
                    name: 'John',
                    age: '30',
                },
            },
        ]);
    });

    test('handles multiple root elements', () => {
        const input = '<name>John</name><age>30</age>';
        const result = parseOutSimpleXml(input);
        expect(result).toEqual([{ name: 'John' }, { age: '30' }]);
    });

    test('handles repeated tags as arrays', () => {
        const input = '<person><hobby>reading</hobby><hobby>gaming</hobby></person>';
        const result = parseOutSimpleXml(input);
        expect(result).toEqual([
            {
                person: {
                    hobby: ['reading', 'gaming'],
                },
            },
        ]);
    });

    test('handles deeply nested structures', () => {
        const input = '<root><level1><level2><level3>value</level3></level2></level1></root>';
        const result = parseOutSimpleXml(input);
        expect(result).toEqual([
            {
                root: {
                    level1: {
                        level2: {
                            level3: 'value',
                        },
                    },
                },
            },
        ]);
    });

    test('handles whitespace correctly', () => {
        const input = '  <name>  John  </name>  ';
        const result = parseOutSimpleXml(input);
        expect(result).toEqual([{ name: 'John' }]);
    });

    test('returns text for non-XML input', () => {
        const input = 'Just some text';
        const result = parseOutSimpleXml(input);
        expect(result).toEqual([]);
    });

    test('handles mixed content', () => {
        const input = 'Hello <message><name>John</name></message>!Hello <message><name>John</name></message>!';
        const result = parseOutSimpleXml(input);
        expect(result).toEqual([
            {
                message: {
                    name: 'John',
                },
            },
            {
                message: {
                    name: 'John',
                },
            },
        ]);
    });

    test('handles empty tags', () => {
        const input = '<tag></tag>';
        const result = parseOutSimpleXml(input);
        expect(result).toEqual([{ tag: '' }]);
    });

    test('handles malformed XML gracefully', () => {
        const input = '<tag>unclosed';
        const result = parseOutSimpleXml(input);
        expect(result).toEqual([]);
    });
});
