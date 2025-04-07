/**
 * Utils for converting Zod schemas to XML-like strings for LLM serialization
 */
import { ZodArray, ZodBoolean, ZodNullable, ZodNumber, ZodObject, ZodOptional, ZodString, ZodType } from "zod";

/**
 * @description Converts a Zod schema to an XML-like string representation, starting at the root level
 * with no initial indentation. This is useful for serializing complex data structures for LLM consumption.
 *
 * @param name Root element name
 * @param schema The Zod schema to convert
 * @returns Formatted XML-like string
 */
export function createXmlFromZod(name: string, schema: ZodType): string {
    return _zodToXml(name, schema, 0);
}

/**
 * @description Extracts the description from a Zod type if available
 */
export function getDescription(zodType: ZodType): string {
    const description = zodType._def.description;
    return description || "";
}

/**
 * Recursively converts a Zod schema to an XML-like string with proper indentation
 */
function _zodToXml(name: string, zodSchema: ZodType, indentLevel = 0): string {
    const indent = "    ".repeat(indentLevel);

    // Handle ZodObject
    if (zodSchema instanceof ZodObject) {
        return _handleZodObject(name, zodSchema, indent, indentLevel);
    }

    // Handle ZodArray
    if (zodSchema instanceof ZodArray) {
        return _handleZodArray(name, zodSchema, indent);
    }

    // Handle ZodString, ZodNumber, ZodBoolean
    if (zodSchema instanceof ZodString || zodSchema instanceof ZodNumber || zodSchema instanceof ZodBoolean) {
        const description = getDescription(zodSchema);
        return `${indent}<${name}>${description}</${name}>`;
    }

    // Handle ZodOptional & ZodNullable
    if (zodSchema instanceof ZodOptional || zodSchema instanceof ZodNullable) {
        const innerType = zodSchema._def.innerType;
        return _zodToXml(name, innerType, indentLevel);
    }

    // Default case - try to get description or return empty
    const description = getDescription(zodSchema);
    return `${indent}<${name}>${description}</${name}>`;
}

/**
 * Helper function to handle ZodObject conversion
 */
function _handleZodObject(name: string, zodSchema: ZodObject<any>, indent: string, indentLevel: number): string {
    const shape = zodSchema._def.shape();
    const keys = Object.keys(shape);

    if (keys.length === 0) {
        return `${indent}<${name}></${name}>`;
    }

    const children = keys
        .map((key) => {
            const fieldSchema = shape[key];
            return _zodToXml(key, fieldSchema, indentLevel + 1);
        })
        .join("\n");

    return `${indent}<${name}>\n${children}\n${indent}</${name}>`;
}

/**
 * Helper function to handle ZodArray conversion
 */
function _handleZodArray(name: string, zodSchema: ZodArray<any>, indent: string): string {
    const elementType = zodSchema._def.type;
    const description = getDescription(zodSchema);

    if (description) {
        return `${indent}<${name}>${description}</${name}>`;
    }

    return `${indent}<${name}>\n${indent}    <item>${getDescription(elementType)}</item>\n${indent}</${name}>`;
}
