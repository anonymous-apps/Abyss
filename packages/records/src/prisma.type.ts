import { PrismaConnection } from './prisma';
import { DocumentController } from './records/document/document.controller';
import { ModelConnectionController } from './records/modelConnection/modelConnection.controller';

export interface TableReferences {
    document: DocumentController;
    modelConnection: ModelConnectionController;
}

export function buildTableReferences(connection: PrismaConnection): TableReferences {
    return {
        document: new DocumentController(connection),
        modelConnection: new ModelConnectionController(connection),
    };
}
