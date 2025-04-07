import { describe, expect, it } from "vitest";
import { createXmlFromObject } from "./object-to-xml";

describe("createXmlFromObject", () => {
    describe("handling primitives", () => {
        it("[Happy] should convert string values", () => {
            const result = createXmlFromObject("root", "hello");
            expect(result).toBe("<root>hello</root>");
        });

        it("[Happy] should convert number values", () => {
            const result = createXmlFromObject("root", 42);
            expect(result).toBe("<root>42</root>");
        });

        it("[Happy] should convert boolean values", () => {
            const result = createXmlFromObject("root", true);
            expect(result).toBe("<root>true</root>");
        });

        it("[Happy] should handle null values", () => {
            const result = createXmlFromObject("root", null);
            expect(result).toBe("<root></root>");
        });
    });

    describe("handling objects", () => {
        it("[Happy] should convert simple objects", () => {
            const obj = { name: "John", age: 30 };
            const result = createXmlFromObject("root", obj);
            const expected = "<root>\n    <name>John</name>\n    <age>30</age>\n</root>";
            expect(result).toBe(expected);
        });

        it("[Happy] should convert nested objects", () => {
            const obj = {
                person: {
                    name: "John",
                    address: {
                        city: "New York",
                        zip: 10001,
                    },
                },
            };
            const result = createXmlFromObject("root", obj);
            const expected =
                "<root>\n" +
                "    <person>\n" +
                "        <name>John</name>\n" +
                "        <address>\n" +
                "            <city>New York</city>\n" +
                "            <zip>10001</zip>\n" +
                "        </address>\n" +
                "    </person>\n" +
                "</root>";
            expect(result).toBe(expected);
        });

        it("[Edge] should handle empty objects", () => {
            const result = createXmlFromObject("root", {});
            expect(result).toBe("<root></root>");
        });
    });

    describe("handling arrays", () => {
        it("[Happy] should convert arrays of primitives", () => {
            const arr = [1, 2, 3];
            const expected = "<root>\n" + "    <item>1</item>\n" + "    <item>2</item>\n" + "    <item>3</item>\n" + "</root>";
            const result = createXmlFromObject("root", arr);
            expect(result).toBe(expected);
        });

        it("[Happy] should convert arrays of objects", () => {
            const arr = [
                { id: 1, name: "John" },
                { id: 2, name: "Jane" },
            ];
            const result = createXmlFromObject("root", arr);
            const expected =
                "<root>\n" +
                "    <item>\n" +
                "        <id>1</id>\n" +
                "        <name>John</name>\n" +
                "    </item>\n" +
                "    <item>\n" +
                "        <id>2</id>\n" +
                "        <name>Jane</name>\n" +
                "    </item>\n" +
                "</root>";
            expect(result).toBe(expected);
        });

        it("[Edge] should handle empty arrays", () => {
            const result = createXmlFromObject("root", []);
            expect(result).toBe("<root></root>");
        });
    });
});
