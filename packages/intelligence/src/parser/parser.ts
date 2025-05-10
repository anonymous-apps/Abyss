import { XMLParser, XMLValidator } from 'fast-xml-parser';

export type ParsedBlock = { type: 'text'; content: string } | { type: 'tool'; content: Record<string, unknown> };

/**
 * Parse a raw LLM response that may mix free‑form text with XML‑like tool calls.
 *
 * The algorithm walks the string once, carving out well‑formed XML fragments.
 * Everything else is treated as plain text.
 *
 *  • Each well‑formed fragment must have matching opening and closing tags.
 *  • CDATA is preserved via fast‑xml‑parser.
 *  • Nested tags are supported.
 *  • Invalid/unfinished "tags" fall back to plain text.
 */
export function parseLLMOutput(raw: string): ParsedBlock[] {
    const blocks: ParsedBlock[] = [];
    const parser = new XMLParser({
        ignoreAttributes: true,
        cdataPropName: '__cdata',
        trimValues: true,
    });

    let pos = 0;
    const len = raw.length;

    while (pos < len) {
        const nextOpen = raw.indexOf('<', pos);

        // No more tags → the rest is plain text
        if (nextOpen === -1) {
            pushText(raw.slice(pos));
            break;
        }

        // Attempt to read a tag name right after '<'
        const tagMatch = /^<([A-Za-z][\w\-.]*)([^>]*)>/m.exec(raw.slice(nextOpen));

        // If there isn't a valid start tag, treat the rest as text (including any text before the '<')
        if (!tagMatch) {
            pushText(raw.slice(pos));
            return blocks;
        }

        const [tagOpen, tagName] = tagMatch;

        // Find a matching closing tag, taking nesting into account
        let depth = 0;
        let scan = nextOpen + tagOpen.length;
        let end = -1;

        while (scan < len) {
            const nextOpening = raw.indexOf(`<${tagName}`, scan);
            const nextClosing = raw.indexOf(`</${tagName}>`, scan);

            if (nextClosing === -1) {
                // If we can't find a closing tag, treat the rest as text (from pos to end)
                pushText(raw.slice(pos));
                return blocks;
            }

            if (nextOpening !== -1 && nextOpening < nextClosing) {
                depth++;
                scan = nextOpening + 1;
                continue;
            }

            if (depth === 0) {
                end = nextClosing + tagName.length + 3; // '</' + name + '>'
                break;
            } else {
                depth--;
                scan = nextClosing + 1;
            }
        }

        // Only push text before the next tag if a valid tag is found and we are going to continue parsing
        if (nextOpen > pos) {
            pushText(raw.slice(pos, nextOpen));
        }

        const xmlChunk = raw.slice(nextOpen, end);

        // Validate the candidate chunk before trusting it as XML
        if (XMLValidator.validate(xmlChunk) === true) {
            const parsed = parser.parse(xmlChunk);
            // Handle CDATA content by flattening it
            const flattened = flattenCDATA(parsed);
            blocks.push({ type: 'tool', content: flattened });
            pos = end;
        } else {
            // If not valid XML, treat the rest as text (including any text before the '<')
            pushText(raw.slice(pos));
            return blocks;
        }
    }

    return blocks;

    // --- helpers --------------------------------------------------------------
    function pushText(segment: string) {
        const trimmed = segment.replace(/^[\s\r\n]+|[\s\r\n]+$/g, '');
        if (trimmed) {
            blocks.push({ type: 'text', content: trimmed });
        }
    }

    function flattenCDATA(obj: any): any {
        if (obj && typeof obj === 'object') {
            if (obj.__cdata !== undefined) {
                return obj.__cdata.trim();
            }
            const result: any = {};
            for (const key in obj) {
                result[key] = flattenCDATA(obj[key]);
            }
            return result;
        }
        return obj;
    }
}
