export interface XmlNode {
    [key: string]: XmlValue;
}

export type XmlValue = string | XmlNode | Array<XmlValue>;

export function parseXml(input: string): XmlNode[] {
    const results: XmlNode[] = [];
    // Updated regex to handle attributes in tags
    const regex = /<([a-zA-Z0-9_-]+)(?:\s+[^>]*)?>([\s\S]*?)<\/\1>/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(input)) !== null) {
        const xmlSnippet = match[0];
        try {
            const parsed = recurseParse(xmlSnippet);
            results.push(parsed);
        } catch (error) {
            console.error("Error parsing XML snippet:", xmlSnippet, error);
        }
    }

    return results;
}

// Helper function: Recursively parses a simple XML snippet into an object.
function recurseParse(xml: string): XmlNode {
    xml = xml.trim();
    // Updated regex to handle attributes in tags
    const tagRegex = /^<([a-zA-Z0-9_-]+)(?:\s+[^>]*)?>([\s\S]*)<\/\1>$/;
    const regexResult = tagRegex.exec(xml);

    if (!regexResult) {
        // If the snippet doesn't match a simple XML pattern, return it as plain text
        return { text: xml };
    }

    const [, tagName, innerXml] = regexResult;
    // Don't trim innerXml to preserve whitespace

    // If there's no nested tag, return the text content
    if (!innerXml.trim().startsWith("<")) {
        return { [tagName]: innerXml.trim() === "" ? innerXml : innerXml.trim() };
    }

    // Otherwise, parse the nested (child) XML elements
    // Updated regex to handle attributes in tags
    const childRegex = /<([a-zA-Z0-9_-]+)(?:\s+[^>]*)?>([\s\S]*?)<\/\1>/g;
    const children: Record<string, XmlValue> = {};
    let childMatch: RegExpExecArray | null;

    while ((childMatch = childRegex.exec(innerXml)) !== null) {
        const childTag = childMatch[1];
        const childSnippet = childMatch[0];
        const childParsed = recurseParse(childSnippet);
        const childValue = Object.values(childParsed)[0];

        // Handle multiple occurrences of the same tag: convert to an array
        if (Object.prototype.hasOwnProperty.call(children, childTag)) {
            const existing = children[childTag];
            if (Array.isArray(existing)) {
                existing.push(childValue);
            } else {
                children[childTag] = [existing, childValue];
            }
        } else {
            children[childTag] = childValue;
        }
    }

    // If no children were found, return the inner text
    if (Object.keys(children).length === 0) {
        return { [tagName]: innerXml.trim() === "" ? innerXml : innerXml.trim() };
    }

    return { [tagName]: children };
}
