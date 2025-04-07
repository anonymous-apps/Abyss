/**
 * @description Removes leading indentation from multi-line strings while preserving relative indentation.
 * Handles special cases like code blocks with triple backticks and respects object structure.
 * @param str - The string to process and remove leading indentation from
 * @returns The dedented string with consistent indentation removed
 */
export function dedent(str: string): string {
    return _processDedent(str);
}

/**
 * Processes the string to remove consistent leading whitespace while respecting
 * special structures like code blocks and objects
 * @param str - The string to dedent
 * @returns The dedented string
 */
function _processDedent(str: string): string {
    // Handle edge cases
    if (!str) return "";

    const lines = str.split("\n");
    if (lines.length === 0) return str;

    // Find the first non-empty line to determine base indentation
    const firstNonEmptyLine = lines.find((line) => line.trim() !== "");
    if (!firstNonEmptyLine) return "";

    // Calculate the common indentation level from the first non-empty line
    const baseIndentationLength = _getLeadingWhitespaceLength(firstNonEmptyLine);

    // Track special syntax states
    let isInsideCodeBlock = false;
    let isInsideObjectLiteral = false;
    const bracketStack: string[] = [];

    // Process each line
    return lines
        .map((line) => {
            // Handle empty lines
            if (line.trim() === "") {
                return "";
            }

            // Toggle code block state when encountering triple backticks
            if (line.includes("```")) {
                isInsideCodeBlock = !isInsideCodeBlock;
            }

            // Track object structure via brackets (unless inside a code block)
            if (!isInsideCodeBlock) {
                for (const char of line) {
                    if (char === "{") {
                        bracketStack.push(char);
                    } else if (char === "}") {
                        bracketStack.pop();
                        if (bracketStack.length === 0) {
                            isInsideObjectLiteral = false;
                        }
                    }
                }
            }

            const currentIndentationLength = _getLeadingWhitespaceLength(line);

            // Preserve full indentation for object literals
            if (isInsideObjectLiteral) {
                return line;
            }

            // When indentation is less than base, preserve it
            if (currentIndentationLength < baseIndentationLength) {
                return line.slice(currentIndentationLength);
            }

            // Update object literal tracking
            if (bracketStack.length > 0) {
                isInsideObjectLiteral = true;
            }

            // Remove base indentation
            return line.slice(baseIndentationLength);
        })
        .join("\n");
}

/**
 * Gets the length of leading whitespace in a string
 * @param str - The string to analyze
 * @returns The number of leading whitespace characters
 */
function _getLeadingWhitespaceLength(str: string): number {
    return /^\s*/.exec(str)?.[0].length || 0;
}
