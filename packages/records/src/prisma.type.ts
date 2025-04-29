import { PrismaConnection } from './prisma';
import { ModelConnectionController } from './records/modelConnection/modelConnection.controller';
import { TextDocumentController } from './records/textDocument/textDocument.controller';

export interface TableReferences {
    textDocument: TextDocumentController;
    modelConnection: ModelConnectionController;
}

export function buildTableReferences(connection: PrismaConnection): TableReferences {
    return {
        textDocument: new TextDocumentController(connection),
        modelConnection: new ModelConnectionController(connection),
    };
}
