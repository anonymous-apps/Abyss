import type { Cell, CellHeader, CellHeader2, CellHeader3, CellText, CellXMLElement } from './promptTemplate.types';
import { dedent } from './utils/dedent';
import { renderXmlCell } from './utils/render-xml';

export class CompiledPrompt {
    public readonly cells: Cell[] = [];

    constructor(cells: Cell[]) {
        this.cells = cells;
    }

    private renderText(cell: CellText): string {
        return dedent(cell.content);
    }

    private renderHeader(cell: CellHeader): string {
        return `\n\n\n# ${cell.content}`;
    }

    private renderHeader2(cell: CellHeader2): string {
        return `\n\n## ${cell.content}`;
    }

    private renderHeader3(cell: CellHeader3): string {
        return `\n### ${cell.content}`;
    }

    private renderXMLElement(cell: CellXMLElement): string {
        return renderXmlCell(cell);
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
                }
            })
            .join('\n');
    }
}
