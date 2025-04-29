import { BaseRecordProps } from '../recordClass';

export interface TextDocument extends BaseRecordProps {
    // Title of this document
    title: string;

    // Type of this document, for now it can only be "markdown"
    type: 'markdown';

    // Raw content of this document
    content: string;

    // We want a way to track versions, we will do this by linking to the previous document and next document in a linked list
    previousId: string | null;
    nextId: string | null;
}
