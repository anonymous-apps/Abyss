import { PrismaConnection } from '../../prisma';
import { RecordController } from '../recordController';
import { AgentGraphRecord } from './agentGraph';

export class AgentGraphController extends RecordController<AgentGraphRecord> {
    constructor(connection: PrismaConnection) {
        super('agentGraph', connection, data => new AgentGraphRecord(this, data));
    }
}
