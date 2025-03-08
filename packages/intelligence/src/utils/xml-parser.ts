export interface XmlNode {
    [key: string]: XmlValue;
}

export type XmlValue = string | XmlNode | Array<XmlValue>;

export function parseOutSimpleXml(input: string): XmlNode[] {
    // Helper function: Recursively parses a simple XML snippet into an object.
    function parseXml(xml: string): XmlNode {
        xml = xml.trim();
        const tagRegex = /^<([a-zA-Z0-9_-]+)>([\s\S]*)<\/\1>$/;
        const regexResult = tagRegex.exec(xml);

        if (!regexResult) {
            // If the snippet doesn't match a simple XML pattern, return it as plain text
            return { text: xml };
        }

        const [, tagName, innerXml] = regexResult;
        const trimmedInner = innerXml.trim();

        // If there's no nested tag, return the text content
        if (!trimmedInner.startsWith('<')) {
            return { [tagName]: trimmedInner };
        }

        // Otherwise, parse the nested (child) XML elements
        const childRegex = /<([a-zA-Z0-9_-]+)>([\s\S]*?)<\/\1>/g;
        const children: Record<string, XmlValue> = {};
        let childMatch: RegExpExecArray | null;

        while ((childMatch = childRegex.exec(trimmedInner)) !== null) {
            const childTag = childMatch[1];
            const childSnippet = childMatch[0];
            const childParsed = parseXml(childSnippet);
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
            return { [tagName]: trimmedInner };
        }

        return { [tagName]: children };
    }

    const results: XmlNode[] = [];
    // Regex to match top-level XML snippets in the input
    const regex = /<([a-zA-Z0-9_-]+)>([\s\S]*?)<\/\1>/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(input)) !== null) {
        const xmlSnippet = match[0];
        try {
            const parsed = parseXml(xmlSnippet);
            results.push(parsed);
        } catch (error) {
            console.error('Error parsing XML snippet:', xmlSnippet, error);
        }
    }

    return results;
}
