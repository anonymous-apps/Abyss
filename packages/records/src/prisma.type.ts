import { PrismaConnection } from './prisma';
import { MessageThreadController } from './records/messageThread/messageThread.controller';
import { ModelConnectionController } from './records/modelConnection/modelConnection.controller';
import { TextDocumentController } from './records/textDocument/textDocument.controller';

export interface TableReferences {
    textDocument: TextDocumentController;
    modelConnection: ModelConnectionController;
    messageThread: MessageThreadController;
}

export function buildTableReferences(connection: PrismaConnection): TableReferences {
    return {
        textDocument: new TextDocumentController(connection),
        modelConnection: new ModelConnectionController(connection),
        messageThread: new MessageThreadController(connection),
    };
}
