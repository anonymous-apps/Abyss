import { describe, expect, it } from 'vitest';
import { renderXmlCell } from './render-xml';

describe('renderXmlCell', () => {
    it('should render a simple xml element', () => {
        const result = renderXmlCell({
            type: 'xmlElement',
            content: {
                name: 'test',
                value: 'test',
            },
        });
        expect(result).toMatchSnapshot();
    });

    it('should render a nested xml element', () => {
        const result = renderXmlCell({
            type: 'xmlElement',
            content: {
                name: 'test',
                value: {
                    childName: 'nestedTest',
                    childValue: 'nestedValue',
                },
            },
        });
        expect(result).toMatchSnapshot();
    });

    it('should render multiple sibling elements', () => {
        const result = renderXmlCell({
            type: 'xmlElement',
            content: {
                item1: 'first',
                item2: 'second',
                item3: 'third',
            },
        });
        expect(result).toMatchSnapshot();
    });

    it('should render deeply nested xml elements', () => {
        const result = renderXmlCell({
            type: 'xmlElement',
            content: {
                level1: {
                    level2: {
                        level3: {
                            text: 'deep value',
                        },
                    },
                },
            },
        });
        expect(result).toMatchSnapshot();
    });

    it('should handle string values with dedent', () => {
        const multilineString = 'This is a\nmultiline string.';
        const result = renderXmlCell({
            type: 'xmlElement',
            content: {
                data: multilineString,
            },
        });
        expect(result).toMatchSnapshot();
    });

    it('should render non-string primitive values', () => {
        const result = renderXmlCell({
            type: 'xmlElement',
            content: {
                count: 123,
                isActive: true,
                isNull: null,
                isUndefined: undefined,
            },
        });
        expect(result).toMatchSnapshot();
    });

    it('should render an empty content object as an empty string with newlines', () => {
        const result = renderXmlCell({
            type: 'xmlElement',
            content: {},
        });
        expect(result).toMatchSnapshot();
    });
});
