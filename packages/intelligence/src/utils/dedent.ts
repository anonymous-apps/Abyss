export function dedent(str: string): string {
    const lines = str.split('\n');
    if (lines.length === 0) return str;

    const firstLine = lines.find(line => line.trim() !== '');

    if (!firstLine) return '';

    const leadingWhitespace = /^\s*/.exec(firstLine)?.[0].length || 0;
    let insideObject = false;
    let insideQuotes = false;
    const bracketStack: string[] = [];

    return lines
        .map(line => {
            if (line.trim() === '') {
                return '';
            }

            if (line.includes('```')) {
                insideQuotes = !insideQuotes;
            }

            if (!insideQuotes) {
                for (const char of line) {
                    if (char === '{') {
                        bracketStack.push(char);
                    } else if (char === '}') {
                        bracketStack.pop();
                        if (bracketStack.length === 0) {
                            insideObject = false;
                        }
                    }
                }
            }

            const totalLeadingWhitespace = /^\s*/.exec(line)?.[0].length || 0;

            if (insideObject) {
                return line;
            }
            if (totalLeadingWhitespace < leadingWhitespace) {
                return line.slice(totalLeadingWhitespace);
            }

            if (bracketStack.length > 0) {
                insideObject = true;
            }

            return line.slice(leadingWhitespace);
        })
        .join('\n');
}
