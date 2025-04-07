import { describe, expect, it } from "vitest";
import { dedent } from "./dedent";

describe("dedent", () => {
    describe("dedent function", () => {
        it("[Happy] should remove leading indentation from a multi-line string", () => {
            const input = `
        Hello
          World
            !
      `;
            const result = dedent(input);

            expect(result.trim()).toBe("Hello\n  World\n    !");
        });

        it("[Happy] should respect code blocks with triple backticks", () => {
            const input = `
        Some text
        \`\`\`
        const code = "not dedented";
        \`\`\`
        More text
      `;

            const result = dedent(input);

            expect(result.includes("```\nconst code")).toBe(true);
            expect(result.includes("```\nMore text")).toBe(true);
        });

        it("[Happy] should handle object literals correctly", () => {
            const input = `
        const obj = {
          prop1: "value1",
          prop2: {
            nestedProp: "nestedValue"
          }
        };
      `;

            const result = dedent(input);

            expect(result.includes('prop1: "value1"')).toBe(true);
            expect(result.includes('nestedProp: "nestedValue"')).toBe(true);
        });

        it("[Edge] should return empty string for empty input", () => {
            expect(dedent("")).toBe("");
            expect(dedent("\n\n")).toBe("");
        });

        it("[Edge] should handle single line strings", () => {
            const input = "  Hello World";
            const expected = "Hello World";

            const result = dedent(input);

            expect(result).toBe(expected);
        });

        it("[Edge] should handle strings with no indentation", () => {
            const input = "Hello\nWorld\n!";

            const result = dedent(input);

            expect(result).toBe(input);
        });

        it("[Edge] should preserve relative indentation", () => {
            const input = `
        First level
          Second level
        Back to first
            Fourth level
      `;

            const result = dedent(input);

            const lines = result.trim().split("\n");
            expect(lines[0]).toBe("First level");
            expect(lines[1]).toBe("  Second level");
            expect(lines[2]).toBe("Back to first");
            expect(lines[3]).toBe("    Fourth level");
        });

        it("[Edge] should handle strings with only whitespace", () => {
            const input = "   \n  \n    ";
            expect(dedent(input)).toBe("");
        });
    });
});
