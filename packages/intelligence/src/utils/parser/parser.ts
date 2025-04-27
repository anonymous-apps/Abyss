import { v4 as uuidv4 } from 'uuid';
import { ThreadMessagePartial } from '../../constructs/thread/types';
import { Log } from '../logs';

// Helper to parse the inner content of a tool tag into an args object or return raw string
function parseXmlContent(xmlContent: string): Record<string, any> | string {
    const trimmedContent = xmlContent.trim();

    // Handle CDATA as a literal string value, keeping the wrapper
    if (trimmedContent.startsWith('<![CDATA[') && trimmedContent.endsWith(']]>')) {
        // Extract content between <![CDATA[ and ]]>
        // Calculate the start index after <![CDATA[ (length 9)
        const startIndex = xmlContent.indexOf('<![CDATA[') + 9;
        // Calculate the end index before ]]>
        const endIndex = xmlContent.lastIndexOf(']]>');
        // Extract the content
        return xmlContent.substring(startIndex, endIndex);
    }

    const children: Record<string, any> = {};
    let textContent = '';
    let hasTags = false;
    let currentPos = 0;

    while (currentPos < xmlContent.length) {
        const nextTagStart = xmlContent.indexOf('<', currentPos);
        if (nextTagStart === -1) {
            // No more tags, append remaining text
            textContent += xmlContent.substring(currentPos);
            break;
        }

        // Append text before the tag
        textContent += xmlContent.substring(currentPos, nextTagStart);

        const nextTagEnd = xmlContent.indexOf('>', nextTagStart);
        if (nextTagEnd === -1) {
            // Malformed XML (no '>'), treat rest as text
            textContent += xmlContent.substring(nextTagStart);
            break;
        }

        const tag = xmlContent.substring(nextTagStart, nextTagEnd + 1);
        // Match simple start tags e.g. <tag> - Updated to include dashes
        const startTagNameMatch = tag.match(/^<([\w-]+)>$/);
        // Check if the tag starts a CDATA section
        const cdataStartMatch = xmlContent.substring(nextTagStart).match(/^<!\[CDATA\[/);

        if (startTagNameMatch) {
            hasTags = true;
            const tagName = startTagNameMatch[1];
            const endTag = `</${tagName}>`;
            // Find the corresponding end tag, handling nesting
            const endTagPos = findMatchingEndTag(xmlContent, tagName, nextTagEnd + 1);

            if (endTagPos === -1) {
                // No matching end tag found, treat the start tag as text and continue parsing after it
                textContent += tag;
                currentPos = nextTagEnd + 1;
            } else {
                // Found matching end tag, parse its content recursively
                const content = xmlContent.substring(nextTagEnd + 1, endTagPos);
                children[tagName] = parseXmlContent(content);
                currentPos = endTagPos + endTag.length;
            }
        } else if (cdataStartMatch) {
            // Found CDATA section start, find its end
            const cdataEnd = ']]>';
            const cdataEndPos = xmlContent.indexOf(cdataEnd, nextTagStart + 9); // Start search after "<![CDATA["
            if (cdataEndPos === -1) {
                // Malformed CDATA (no ']]>'), treat start as text
                textContent += xmlContent.substring(nextTagStart);
                break;
            } else {
                // Valid CDATA found, treat the whole block as text content for this level
                textContent += xmlContent.substring(nextTagStart, cdataEndPos + cdataEnd.length);
                currentPos = cdataEndPos + cdataEnd.length;
            }
        } else {
            // Not a simple start tag or CDATA start, treat the tag as text
            textContent += tag;
            currentPos = nextTagEnd + 1;
        }
    }

    const trimmedText = textContent.trim();

    // If there were child tags parsed, return the children object.
    // Check for disallowed mixed content (tags and non-whitespace text).
    if (hasTags) {
        if (trimmedText) {
            Log.warn('parseXmlContent', xmlContent);
            throw new Error('Tool calls cannot have mixed content: text and tags found together inside a tag.');
        }
        return children;
    }

    // If no tags were found, return the original (untrimmed) text content.
    // This preserves CDATA structure and any surrounding whitespace if it was the sole content.
    return xmlContent;
}

// Helper function to find the matching end tag index, correctly handling nesting of the *same* tag name.
function findMatchingEndTag(str: string, tagName: string, startIndex: number): number {
    let nestingLevel = 1;
    const startTag = `<${tagName}>`;
    const endTag = `</${tagName}>`;
    let searchPos = startIndex;

    while (nestingLevel > 0 && searchPos < str.length) {
        // Find the next potential start or end tag for the *same* tagName
        const nextStartTagPos = str.indexOf(startTag, searchPos);
        const nextEndTagPos = str.indexOf(endTag, searchPos);

        if (nextEndTagPos === -1) {
            // No more closing tags for this tagName exist in the rest of the string
            return -1;
        }

        // Check if a nested start tag appears before the next closing tag
        if (nextStartTagPos !== -1 && nextStartTagPos < nextEndTagPos) {
            // Found a nested start tag first, increase nesting level
            nestingLevel++;
            // Continue searching after this nested start tag
            searchPos = nextStartTagPos + startTag.length;
        } else {
            // Found a closing tag first
            nestingLevel--;
            if (nestingLevel === 0) {
                // This is the matching closing tag for the initial start tag
                return nextEndTagPos;
            }
            // This closing tag matched a nested start tag, continue searching after it
            searchPos = nextEndTagPos + endTag.length;
        }
    }

    // If the loop finishes without finding the matching closing tag (nestingLevel never reached 0)
    return -1;
}

// Main parsing function to split string into text and tool call messages
export function parseString(input: string): ThreadMessagePartial[] {
    const result: ThreadMessagePartial[] = [];
    let currentPos = 0;

    while (currentPos < input.length) {
        // Find the start of the next potential tag
        const nextTagStart = input.indexOf('<', currentPos);

        if (nextTagStart === -1) {
            // No more '<' found, the rest of the string is text
            const text = input.substring(currentPos);
            if (text.length > 0) {
                result.push({ type: 'text', text: { content: text } });
            }
            break; // End of parsing
        }

        // Append text found before this potential tag
        const textBeforeTag = input.substring(currentPos, nextTagStart);
        if (textBeforeTag.length > 0) {
            result.push({ type: 'text', text: { content: textBeforeTag } });
        }

        // Find the end of the potential tag
        const nextTagEnd = input.indexOf('>', nextTagStart);
        if (nextTagEnd === -1) {
            // No closing '>' found for this '<', treat the rest of the string as text
            const remainingText = input.substring(nextTagStart);
            if (remainingText.length > 0) {
                result.push({ type: 'text', text: { content: remainingText } });
            }
            break; // End of parsing due to malformed tag
        }

        // Extract the potential tag including < and >
        const potentialTag = input.substring(nextTagStart, nextTagEnd + 1);
        const tagNameMatch = potentialTag.match(/^<([\w-]+)>$/);

        if (tagNameMatch) {
            // It looks like a simple start tag <tagname>. Try to find its matching end tag.
            const tagName = tagNameMatch[1];
            const endTag = `</${tagName}>`;
            const endTagPos = findMatchingEndTag(input, tagName, nextTagEnd + 1);

            if (endTagPos !== -1) {
                // Found the matching end tag. Process the content as a tool call.
                const content = input.substring(nextTagEnd + 1, endTagPos);
                let args: Record<string, any> | string;
                try {
                    args = parseXmlContent(content);
                } catch (e: any) {
                    // Propagate errors from content parsing (e.g., mixed content)
                    throw new Error(`Error parsing content of <${tagName}>: ${e.message}`);
                }

                if (typeof args === 'string') {
                    // Content parsed to a string (text-only or CDATA).
                    // Tool calls require keyed arguments (tags inside). Direct text is invalid unless it's just whitespace.
                    if (args.trim()) {
                        Log.warn('parseString', input);
                        throw new Error(
                            `Tool <${tagName}> must have keyed arguments (e.g., <key>value</key>). Direct text content "${args}" is not allowed.`
                        );
                    }
                    // If args is empty or whitespace string, treat as a tool call with empty args.
                    result.push({ type: 'toolRequest', toolRequest: { callId: uuidv4(), shortId: tagName, name: tagName, args: {} } });
                } else {
                    // Content parsed to an object (valid keyed arguments).
                    result.push({ type: 'toolRequest', toolRequest: { callId: uuidv4(), shortId: tagName, name: tagName, args: args } });
                }
                // Continue parsing after the complete tool call structure (including the end tag)
                currentPos = endTagPos + endTag.length;
            } else {
                // Malformed XML: No matching end tag found for the start tag.
                // Treat the start tag itself as text and continue parsing *after* it.
                result.push({ type: 'text', text: { content: potentialTag } });
                currentPos = nextTagEnd + 1;
            }
        } else {
            // The potential tag is not a simple start tag (e.g., '</tag>', '<tag/>', '<?xml?>', '<!CDATA[..]]>', or just '< >')
            // Treat the entire potential tag structure as text.
            result.push({ type: 'text', text: { content: potentialTag } });
            // Continue parsing after this text block
            currentPos = nextTagEnd + 1;
        }
    }
    return result;
}
