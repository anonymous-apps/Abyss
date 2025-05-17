/**
 * Removes the common leading whitespace from all lines in a string.
 * This is useful for template literals that need to be indented in the source code
 * but should not have that indentation in the output.
 *
 * @param text The string to dedent
 * @returns The dedented string
 */
export function dedent(text: string): string {
    // Split the text into lines
    const lines = text.split('\n');

    // Find lines that have content (not just whitespace)
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);

    if (nonEmptyLines.length === 0) {
        return text;
    }

    // Find the minimum indentation level across all non-empty lines
    const minIndent = nonEmptyLines.reduce((min, line) => {
        const indent = line.match(/^[ \t]*/)?.[0].length || 0;
        return indent < min ? indent : min;
    }, Number.POSITIVE_INFINITY);

    if (minIndent === 0 || minIndent === Number.POSITIVE_INFINITY) {
        return text;
    }

    // Remove the common indentation from all lines
    return lines.map(line => (line.length > 0 ? line.substring(minIndent) : line)).join('\n');
}
