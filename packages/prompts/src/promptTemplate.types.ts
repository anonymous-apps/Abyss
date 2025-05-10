import { CompiledPrompt } from './compiledPrompt';

export type UncompiledCell<T> =
    | Cell
    | {
          outType: Cell['type'];
          compile: (vars: T) => any;
      };

export type PromptHandlerParams<CellType, TemplateParams> =
    | CellType
    | CellType[]
    | undefined
    | ((vars: TemplateParams) => CellType | CellType[] | Cell | Cell[] | undefined);

export type CellText = { type: 'text'; content: string };
export type CellHeader = { type: 'header'; content: string };
export type CellHeader2 = { type: 'header2'; content: string };
export type CellHeader3 = { type: 'header3'; content: string };
export type CellXMLElement = { type: 'xmlElement'; content: any };
export type CellSubPrompt = { type: 'subPrompt'; content: CompiledPrompt };

export type Cell = CellText | CellHeader | CellHeader2 | CellHeader3 | CellXMLElement | CellSubPrompt;

export type CellTextParams<T> = PromptHandlerParams<CellText, T>;
export type CellHeaderParams<T> = PromptHandlerParams<CellHeader, T>;
export type CellHeader2Params<T> = PromptHandlerParams<CellHeader2, T>;
export type CellHeader3Params<T> = PromptHandlerParams<CellHeader3, T>;
export type CellXMLElementParams<T> = PromptHandlerParams<CellXMLElement, T>;
export type CellSubPromptParams<T> = PromptHandlerParams<CellSubPrompt, T>;
