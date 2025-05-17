import type { NewRecord } from '@abyss/records';
import type { DocumentType, NewCellType } from '@abyss/records/dist/records/document/document.type';

const document: NewRecord<DocumentType> = {
    id: 'document::prompt-document',
    type: 'system',
    name: 'How documents are structured',
    documentContentData: [],
};
const cells: NewCellType[] = [
    {
        authorId: 'system',
        type: 'text',
        content: `
            Documents are vital for passing information to the user and for the user to pass information around the system.
            Documents are not just pure text, (allthough they contain text), rather they are rich notebook style documents which contain indivudual cells.
            Cells are given unique IDs and can be referenced by ID when you want to edit them.
        `,
    },
    {
        authorId: 'system',
        type: 'header',
        content: 'Document cell details',
    },
    {
        authorId: 'system',
        type: 'text',
        content: `
            A document is a list of cells, each cell has an ID and a type
            When a document is rendered, the cells are rendered in the order they are in the document to form a cohesive document.
            Cells are rendered in the order they are in the document.
        `,
    },
    {
        authorId: 'system',
        type: 'text',
        content: `
            There are multiple types of cells, each with their own properties.
        `,
    },
    {
        authorId: 'system',
        type: 'header2',
        content: 'Cell type: header',
    },
    {
        authorId: 'system',
        type: 'text',
        content: `
            A header cell represents a larger section of the document, smaller than the title itself.
            A header can be represented as:
            {
                "type": "header",
                "content": "Header text"
            }
        `,
    },
    {
        authorId: 'system',
        type: 'header2',
        content: 'Cell type: header2',
    },
    {
        authorId: 'system',
        type: 'text',
        content: `
            A header2 cell represents a smaller section of the document, smaller than the header itself.
            A header2 can be represented as:
            {
                "type": "header2",
                "content": "Header2 text"
            }
        `,
    },
    {
        authorId: 'system',
        type: 'header2',
        content: 'Cell type: text',
    },
    {
        authorId: 'system',
        type: 'text',
        content: `
            A text cell represents a paragraph of text in the document.
            A text can be represented as:
            {
                "type": "text",
                "content": "Text content"
            }
        `,
    },
];

export const DocumentDocument = {
    document,
    cells,
};
