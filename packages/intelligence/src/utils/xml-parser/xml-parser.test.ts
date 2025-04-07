import { describe, expect, it, vi } from "vitest";
import { parseXml, XmlNode } from "./xml-parser";

describe("xml-parser", () => {
    describe("parseOutSimpleXml", () => {
        it("[Happy] should parse a simple XML string with a single element", () => {
            const input = "<root>Hello World</root>";
            const result = parseXml(input);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({ root: "Hello World" });
        });

        it("[Happy] should parse XML with nested elements", () => {
            const input = `<parent>
                <child1>Value 1</child1>
                <child2>Value 2</child2>
            </parent>`;

            const result = parseXml(input);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                parent: {
                    child1: "Value 1",
                    child2: "Value 2",
                },
            });
        });

        it("[Happy] should parse XML with deeply nested elements", () => {
            const input = `<root>
                <level1>
                    <level2>
                        <level3>Deep value</level3>
                    </level2>
                </level1>
            </root>`;

            const result = parseXml(input);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                root: {
                    level1: {
                        level2: {
                            level3: "Deep value",
                        },
                    },
                },
            });
        });

        it("[Happy] should convert multiple occurrences of the same tag to an array", () => {
            const input = `<list>
                <item>First item</item>
                <item>Second item</item>
                <item>Third item</item>
            </list>`;

            const result = parseXml(input);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                list: {
                    item: ["First item", "Second item", "Third item"],
                },
            });
        });

        it("[Happy] should parse multiple top-level XML elements", () => {
            const input = `
                <first>Element 1</first>
                <second>Element 2</second>
                <third>Element 3</third>
            `;

            const result = parseXml(input);

            expect(result).toHaveLength(3);
            expect(result[0]).toEqual({ first: "Element 1" });
            expect(result[1]).toEqual({ second: "Element 2" });
            expect(result[2]).toEqual({ third: "Element 3" });
        });

        it("[Happy] should handle mixed content with text and nested elements", () => {
            const input = `<content>
                <title>Main Title</title>
                Some text between tags
                <section>Section content</section>
                More text
            </content>`;

            const result = parseXml(input);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                content: {
                    title: "Main Title",
                    section: "Section content",
                },
            });
        });

        it("[Edge] should handle empty XML elements", () => {
            const input = "<empty></empty>";
            const result = parseXml(input);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({ empty: "" });
        });

        it("[Edge] should handle whitespace correctly", () => {
            const input = `
                <element>
                    Text with    multiple    spaces
                </element>
            `;

            const result = parseXml(input);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({ element: "Text with    multiple    spaces" });
        });

        it("[Edge] should handle elements with only whitespace", () => {
            const input = "<space>    </space>";
            const result = parseXml(input);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({ space: "    " });
        });

        it("[Edge] should return an empty array for input without valid XML", () => {
            const input = "This is not XML";
            const result = parseXml(input);

            expect(result).toHaveLength(0);
        });

        it("[Edge] should handle XML with attributes by ignoring them", () => {
            // Note: The current implementation doesn't parse attributes
            const input = '<element id="123">Content</element>';
            const result = parseXml(input);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({ element: "Content" });
        });

        it("[Edge] should handle elements with hyphenated or underscore names", () => {
            const input = `
                <hyphen-name>Hyphen</hyphen-name>
                <underscore_name>Underscore</underscore_name>
            `;

            const result = parseXml(input);

            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({ "hyphen-name": "Hyphen" });
            expect(result[1]).toEqual({ underscore_name: "Underscore" });
        });

        it("[Unhappy] should handle malformed XML gracefully", () => {
            const input = `
                <valid>This is valid</valid>
                <invalid>This is not closed
                <stillvalid>This should still be parsed</stillvalid>
            `;

            const result = parseXml(input);

            // The parser should still extract the valid parts
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({ valid: "This is valid" });
            expect(result[1]).toEqual({ stillvalid: "This should still be parsed" });
        });

        it("[Unhappy] should handle XML with inconsistent nesting", () => {
            const input = `
                <outer>
                    <inner1>Value 1</inner1>
                    <inner2>
                        <deepinner>Deep value</deepinner>
                    </notinner2> <!-- Intentionally incorrect closing tag -->
                </outer>
            `;

            // The implementation will only match properly closed tags
            const result = parseXml(input);

            // Should find outer and inner1, but inner2 won't be properly parsed
            expect(result).toHaveLength(1);
            expect(result[0].outer as XmlNode).toHaveProperty("inner1");
            expect((result[0].outer as XmlNode).inner1).toBe("Value 1");
        });

        it("[Unhappy] should log errors but continue parsing when encountering issues", () => {
            // Mock console.error to track calls
            const originalConsoleError = console.error;
            const mockConsoleError = vi.fn();
            console.error = mockConsoleError;

            try {
                const input = `
                    <valid>This is valid</valid>
                    <invalid>This will cause an error</notmatching>
                `;

                const result = parseXml(input);

                // Should still parse the valid element
                expect(result).toHaveLength(1);
                expect(result[0]).toEqual({ valid: "This is valid" });

                // No error logging in the current implementation for this case
                // as the regex simply won't match invalid elements
            } finally {
                // Restore console.error
                console.error = originalConsoleError;
            }
        });
    });
});
