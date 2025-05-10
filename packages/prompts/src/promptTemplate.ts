import { CompiledPrompt } from './compiledPrompt';
import { Cell, PromptHandlerParams, UncompiledCell } from './promptTemplate.types';

export class PromptTemplate<IParams = Record<string, any>> {
    private cells: UncompiledCell<IParams>[] = [];

    private addCell(type: Cell['type'], params: PromptHandlerParams<any, IParams>) {
        if (Array.isArray(params)) {
            // Convert array of strings to array of cells
            this.cells.push(...params.map(content => ({ type, content })));
        } else if (typeof params === 'function') {
            this.cells.push({ outType: type, compile: params });
        } else if (!params) {
            return;
        } else {
            this.cells.push({ type, content: params });
        }
    }

    addText(params: PromptHandlerParams<string, IParams>) {
        this.addCell('text', params);
        return this;
    }

    addHeader(params: PromptHandlerParams<string, IParams>) {
        this.addCell('header', params);
        return this;
    }

    addHeader2(params: PromptHandlerParams<string, IParams>) {
        this.addCell('header2', params);
        return this;
    }

    addHeader3(params: PromptHandlerParams<string, IParams>) {
        this.addCell('header3', params);
        return this;
    }

    addXMLElement(params: PromptHandlerParams<any, IParams>) {
        this.addCell('xmlElement', params);
        return this;
    }

    addSubPrompt(params: PromptHandlerParams<CompiledPrompt, IParams>) {
        this.addCell('subPrompt', params);
        return this;
    }

    compile(params: IParams) {
        const resultCells: Cell[] = [];

        for (const cell of this.cells) {
            if ('type' in cell) {
                resultCells.push(cell as Cell);
            } else if ('compile' in cell) {
                const renderFn = cell.compile as (params: IParams) => any[] | any | undefined;
                const compiledCell = renderFn(params);

                if (compiledCell) {
                    if (Array.isArray(compiledCell)) {
                        for (const c of compiledCell) {
                            resultCells.push({
                                type: cell.outType,
                                content: c,
                            });
                        }
                    } else {
                        resultCells.push({
                            type: cell.outType,
                            content: compiledCell,
                        });
                    }
                }
            }
        }

        return new CompiledPrompt(resultCells);
    }
}
