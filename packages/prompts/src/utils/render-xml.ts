import type { CellXMLElement } from '../promptTemplate.types';

export function renderXmlCell(cell: CellXMLElement): string {
    return `\n${handleObject(cell.content).join('\n')}\n`;
}

function renderInlineString(key: string, value: string, indent: number): string {
    return `${'  '.repeat(indent)}<${key}>${value}</${key}>`;
}

function renderMultilineString(key: string, value: string, indent: number): string {
    return `${'  '.repeat(indent)}<${key}>\n${'  '.repeat(indent + 1)}<!CDATA[${value}]>\n${'  '.repeat(indent)}</${key}>`;
}

function renderBoolean(key: string, value: boolean, indent: number): string {
    return `${'  '.repeat(indent)}<${key} boolean="${value ? 'true' : 'false'}" />`;
}

function renderNumber(key: string, value: number, indent: number): string {
    return `${'  '.repeat(indent)}<${key} number="${value}" />`;
}

function renderNull(key: string, indent: number): string {
    return `${'  '.repeat(indent)}<${key} null="true" />`;
}

function renderObject(key: string, value: object, indent: number): string[] {
    const lines: string[] = [];
    lines.push(`${'  '.repeat(indent)}<${key}>`);
    lines.push(...handleObject(value, indent + 1));
    lines.push(`${'  '.repeat(indent)}</${key}>`);
    return lines;
}

const handleObject = (obj: object, indent = 0): string[] => {
    const lines: string[] = [];
    const keys = Object.keys(obj);
    const object = obj as Record<string, unknown>;

    for (const key of keys) {
        const value = object[key];
        if (value === undefined) {
            continue;
        }
        if (value === null) {
            lines.push(renderNull(key, indent));
            continue;
        }
        if (typeof value === 'boolean') {
            lines.push(renderBoolean(key, value, indent));
            continue;
        }
        if (typeof value === 'number') {
            lines.push(renderNumber(key, value, indent));
            continue;
        }
        if (typeof value === 'string') {
            if (value.includes('\n')) {
                lines.push(renderMultilineString(key, value, indent));
            } else {
                lines.push(renderInlineString(key, value, indent));
            }
            continue;
        }
        if (typeof value === 'object') {
            lines.push(...renderObject(key, value, indent));
            continue;
        }

        throw new Error(`Unsupported value type: ${typeof value}`);
    }
    return lines;
};
