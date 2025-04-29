import { PrismaConnection } from './prisma';
import { TextDocumentController } from './records/textDocument/textDocument.controller';

export interface TableReferences {
    textDocument: TextDocumentController;
}

export function buildTableReferences(connection: PrismaConnection): TableReferences {
    return {
        textDocument: new TextDocumentController(connection),
    };
}
