import { PrismaConnection } from '../../prisma';
import { RecordController } from '../recordController';
import { AgentGraphRecord } from './agentGraph';
import { AgentGraphType } from './agentGraph.type';

export class AgentGraphController extends RecordController<AgentGraphType> {
    constructor(connection: PrismaConnection) {
        super('agentGraph', connection, data => new AgentGraphRecord(this, data));
    }
}
