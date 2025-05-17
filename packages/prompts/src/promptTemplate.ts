import { CompiledPrompt } from './compiledPrompt';
import type {
    Cell,
    CellHeader2Params,
    CellHeader3Params,
    CellHeaderParams,
    CellTextParams,
    CellXMLElementParams,
    DynamicCellTemplate,
    PromptHandlerParams,
    StaticCellTemplate,
} from './promptTemplate.types';

export class PromptTemplate<IParams = Record<string, unknown>> {
    private cells: DynamicCellTemplate<Cell, IParams>[] = [];

    private addCell(cell: DynamicCellTemplate<Cell, IParams>) {
        this.cells.push(cell);
    }

    private extractCells(template: StaticCellTemplate<Cell>): Cell[] {
        if (!template) {
            return [];
        }
        if (Array.isArray(template)) {
            return template;
        }
        return [template];
    }

    private addPromptResult(result: PromptHandlerParams<Cell, IParams>) {
        if (!result) {
            return;
        }
        if (Array.isArray(result)) {
            for (const c of result) {
                this.addCell({
                    type: 'static',
                    data: c,
                });
            }
            return;
        }

        if (typeof result === 'function') {
            this.addCell({
                type: 'dynamic',
                outType: 'text',
                compile: result,
            });
            return;
        }

        this.addCell({
            type: 'static',
            data: result,
        });
    }

    addText(params: CellTextParams<IParams>) {
        this.addPromptResult(params);
        return this;
    }

    addHeader(params: CellHeaderParams<IParams>) {
        this.addPromptResult(params);
        return this;
    }

    addHeader2(params: CellHeader2Params<IParams>) {
        this.addPromptResult(params);
        return this;
    }

    addHeader3(params: CellHeader3Params<IParams>) {
        this.addPromptResult(params);
        return this;
    }

    addXMLElement(params: CellXMLElementParams<IParams>) {
        this.addPromptResult(params);
        return this;
    }

    addSubPrompt(prompt: CompiledPrompt) {
        for (const cell of prompt.cells) {
            this.addCell({
                type: 'static',
                data: cell,
            });
        }
        return this;
    }

    compile(params: IParams) {
        const resultCells: Cell[] = [];

        for (const cell of this.cells) {
            if (cell.type === 'static') {
                resultCells.push(cell.data);
            }

            if (cell.type === 'dynamic') {
                const compiledCells = this.extractCells(cell.compile(params));
                resultCells.push(...compiledCells);
            }
        }

        return new CompiledPrompt(resultCells);
    }
}
