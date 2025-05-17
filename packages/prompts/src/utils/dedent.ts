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
    const lineArray = lines.map(line => (line.length > 0 ? line.substring(minIndent) : line));
    while (true) {
        if (lineArray[0] === '') {
            lineArray.shift();
        } else if (lineArray[lineArray.length - 1] === '') {
            lineArray.pop();
        } else {
            break;
        }
    }

    // Remove trailing spaces from each line
    const trimmedLineArray = lineArray.map(line => line.trimEnd());

    return trimmedLineArray.join('\n');
}
