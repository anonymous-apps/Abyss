import { Prisma } from '@prisma/client';
import { notifyTableChanged, prisma } from '../database-connection';
import { BaseDatabaseConnection, BaseRecord } from './_base';

export interface ModelConnectionsRecord extends BaseRecord {
    name: string;
    description: string;
    provider: string;
    modelId: string;
    type: string;
    data?: Record<string, any>;
}

class _ModelConnectionsController extends BaseDatabaseConnection<ModelConnectionsRecord> {
    constructor() {
        super('modelConnections', 'Connections to AI models');
    }
}

export const ModelConnectionsController = new _ModelConnectionsController();
