import { Cell, CellHeader, CellHeader2, CellHeader3, CellSubPrompt, CellText, CellXMLElement } from './promptTemplate.types';

export class CompiledPrompt {
    constructor(public readonly cells: Cell[]) {}

    getCells(): Cell[] {
        return [...this.cells];
    }

    private renderText(cell: CellText): string {
        return cell.content;
    }

    private renderHeader(cell: CellHeader): string {
        return `# ${cell.content}`;
    }

    private renderHeader2(cell: CellHeader2): string {
        return `## ${cell.content}`;
    }

    private renderHeader3(cell: CellHeader3): string {
        return `### ${cell.content}`;
    }

    private renderXMLElement(cell: CellXMLElement): string {
        const handleObject = (obj: any, indent = 0): string[] => {
            let lines: string[] = [];
            let keys = Object.keys(obj);
            for (const key of keys) {
                if (obj.hasOwnProperty(key)) {
                    const value = obj[key];
                    if (typeof value === 'object' && value !== null) {
                        lines.push(`${'    '.repeat(indent)}<${key}>`);
                        lines.push(...handleObject(value, indent + 2));
                        lines.push(`${'    '.repeat(indent)}</${key}>`);
                    } else {
                        lines.push(`${'    '.repeat(indent)}<${key}>${value}</${key}>`);
                    }
                }
            }
            return lines;
        };
        return handleObject(cell.content).join('\n');
    }

    private renderSubPrompt(cell: CellSubPrompt): string {
        return cell.content.render();
    }

    render(): string {
        return this.cells
            .map(cell => {
                switch (cell.type) {
                    case 'text':
                        return this.renderText(cell);
                    case 'header':
                        return this.renderHeader(cell);
                    case 'header2':
                        return this.renderHeader2(cell);
                    case 'header3':
                        return this.renderHeader3(cell);
                    case 'xmlElement':
                        return this.renderXMLElement(cell);
                    case 'subPrompt':
                        return this.renderSubPrompt(cell);
                }
            })
            .join('\n');
    }
}
