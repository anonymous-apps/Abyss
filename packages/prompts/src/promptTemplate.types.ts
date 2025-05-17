export type CellText = {
    type: 'text';
    content: string;
};

export type CellHeader = {
    type: 'header';
    content: string;
};

export type CellHeader2 = {
    type: 'header2';
    content: string;
};

export type CellHeader3 = {
    type: 'header3';
    content: string;
};

export type CellXMLElement = {
    type: 'xmlElement';
    content: object;
};

export type Cell = CellText | CellHeader | CellHeader2 | CellHeader3 | CellXMLElement;
export type CellType = Cell['type'];

// Represents a static cell type which no longer needs to be compiled
export type StaticCellTemplate<ICell extends Cell = Cell> = ICell | ICell[] | undefined;

// Represents a cell that is not yet compiled
export type DynamicCellTemplate<ICell extends Cell, TemplateParams = unknown> =
    | {
          type: 'static';
          data: Cell;
      }
    | {
          type: 'dynamic';
          outType: CellType;
          compile: (vars: TemplateParams) => StaticCellTemplate<ICell>;
      };

// Type for function which builds a given cell type
export type PromptHandlerParams<ICell extends Cell, TemplateParams = unknown> =
    | StaticCellTemplate<ICell>
    | ((vars: TemplateParams) => StaticCellTemplate<ICell>);

export type CellTextParams<T> = PromptHandlerParams<CellText, T>;
export type CellHeaderParams<T> = PromptHandlerParams<CellHeader, T>;
export type CellHeader2Params<T> = PromptHandlerParams<CellHeader2, T>;
export type CellHeader3Params<T> = PromptHandlerParams<CellHeader3, T>;
export type CellXMLElementParams<T> = PromptHandlerParams<CellXMLElement, T>;
