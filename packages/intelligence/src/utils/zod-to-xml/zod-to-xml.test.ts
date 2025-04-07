import { describe, expect, it } from "vitest";
import { z } from "zod";
import { createXmlFromZod, getDescription } from "./zod-to-xml";

describe("zod-to-xml", () => {
    describe("getDescription", () => {
        it("[Happy] should return the description from a Zod type", () => {
            const schema = z.string().describe("A string description");
            const result = getDescription(schema);
            expect(result).toBe("A string description");
        });

        it("[Happy] should return an empty string when description is not set", () => {
            const schema = z.string();
            const result = getDescription(schema);
            expect(result).toBe("");
        });
    });

    describe("createXmlFromZod", () => {
        it("[Happy] should handle a simple string schema", () => {
            const schema = z.string().describe("A string value");
            const result = createXmlFromZod("root", schema);
            expect(result).toBe("<root>A string value</root>");
        });

        it("[Happy] should handle a simple number schema", () => {
            const schema = z.number().describe("A number value");
            const result = createXmlFromZod("root", schema);
            expect(result).toBe("<root>A number value</root>");
        });

        it("[Happy] should handle a simple boolean schema", () => {
            const schema = z.boolean().describe("A boolean value");
            const result = createXmlFromZod("root", schema);
            expect(result).toBe("<root>A boolean value</root>");
        });

        it("[Happy] should handle an empty object schema", () => {
            const schema = z.object({});
            const result = createXmlFromZod("root", schema);
            expect(result).toBe("<root></root>");
        });

        it("[Happy] should handle a complex object schema", () => {
            const schema = z.object({
                name: z.string().describe("User's name"),
                age: z.number().describe("User's age"),
                isActive: z.boolean().describe("Whether user is active"),
            });

            const expected = `<root>
    <name>User's name</name>
    <age>User's age</age>
    <isActive>Whether user is active</isActive>
</root>`;

            const result = createXmlFromZod("root", schema);
            expect(result).toBe(expected);
        });

        it("[Happy] should handle nested object schemas", () => {
            const schema = z.object({
                user: z.object({
                    name: z.string().describe("User's name"),
                    age: z.number().describe("User's age"),
                }),
            });

            const expected = `<root>
    <user>
        <name>User's name</name>
        <age>User's age</age>
    </user>
</root>`;

            const result = createXmlFromZod("root", schema);
            expect(result).toBe(expected);
        });

        it("[Happy] should handle array schemas with description", () => {
            const schema = z.array(z.string()).describe("List of names");
            const result = createXmlFromZod("names", schema);
            expect(result).toBe("<names>List of names</names>");
        });

        it("[Happy] should handle array schemas without description", () => {
            const itemSchema = z.string().describe("A string item");
            const schema = z.array(itemSchema);

            const expected = `<items>
    <item>A string item</item>
</items>`;

            const result = createXmlFromZod("items", schema);
            expect(result).toBe(expected);
        });

        it("[Happy] should handle optional schemas", () => {
            const schema = z.string().describe("Optional value").optional();
            const result = createXmlFromZod("optional", schema);
            expect(result).toBe("<optional>Optional value</optional>");
        });

        it("[Happy] should handle nullable schemas", () => {
            const schema = z.string().describe("Nullable value").nullable();
            const result = createXmlFromZod("nullable", schema);
            expect(result).toBe("<nullable>Nullable value</nullable>");
        });

        it("[Edge] should handle complex nested structures with mixed types", () => {
            const schema = z.object({
                user: z.object({
                    name: z.string().describe("User's name"),
                    contacts: z
                        .array(
                            z.object({
                                type: z.string().describe("Contact type"),
                                value: z.string().describe("Contact value"),
                                isPrimary: z.boolean().optional().describe("Is primary contact"),
                            })
                        )
                        .describe("User's contacts"),
                }),
                metadata: z
                    .object({
                        created: z.string().describe("Creation date"),
                        lastUpdated: z.string().describe("Last update date"),
                    })
                    .optional(),
            });

            const expected = `<root>
    <user>
        <name>User's name</name>
        <contacts>User's contacts</contacts>
    </user>
    <metadata>
        <created>Creation date</created>
        <lastUpdated>Last update date</lastUpdated>
    </metadata>
</root>`;

            const result = createXmlFromZod("root", schema);
            expect(result).toBe(expected);
        });
    });
});
