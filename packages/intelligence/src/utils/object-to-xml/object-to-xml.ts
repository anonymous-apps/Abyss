/**
 * Utils for converting JavaScript objects to XML-like strings for LLM serialization
 */

/**
 * @description Converts a JavaScript object to an XML-like string representation, starting at the root level
 * with no initial indentation. This is useful for serializing complex data structures for LLM consumption.
 *
 * @param name Root element name
 * @param obj The JavaScript object to convert
 * @returns Formatted XML-like string
 */
export function createXmlFromObject(name: string, obj: any): string {
    return _objectToXml(name, obj, 0);
}

/**
 * Recursively converts a JavaScript object to an XML-like string with proper indentation
 */
function _objectToXml(name: string, value: any, indentLevel = 0): string {
    const indent = '    '.repeat(indentLevel);

    // Handle null and undefined
    if (value === null || value === undefined) {
        return `${indent}<${name}></${name}>`;
    }

    // Handle objects (non-arrays)
    if (typeof value === 'object' && !Array.isArray(value)) {
        return _handleObject(name, value, indent, indentLevel);
    }

    // Handle arrays
    if (Array.isArray(value)) {
        return _handleArray(name, value, indent, indentLevel);
    }

    // Handle primitives (string, number, boolean)
    return `${indent}<${name}>${value}</${name}>`;
}

/**
 * Helper function to handle Object conversion
 */
function _handleObject(name: string, obj: object, indent: string, indentLevel: number): string {
    const keys = Object.keys(obj);

    if (keys.length === 0) {
        return `${indent}<${name}></${name}>`;
    }

    const children = keys
        .map(key => {
            return _objectToXml(key, obj[key as keyof typeof obj], indentLevel + 1);
        })
        .join('\n');

    return `${indent}<${name}>\n${children}\n${indent}</${name}>`;
}

/**
 * Helper function to handle Array conversion
 */
function _handleArray(name: string, arr: any[], indent: string, indentLevel: number): string {
    if (arr.length === 0) {
        return `${indent}<${name}></${name}>`;
    }

    const children = arr
        .map((item, index) => {
            return _objectToXml('item', item, indentLevel + 1);
        })
        .join('\n');

    return `${indent}<${name}>\n${children}\n${indent}</${name}>`;
}
