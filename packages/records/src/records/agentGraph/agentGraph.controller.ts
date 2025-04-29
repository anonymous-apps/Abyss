import { PrismaConnection } from '../../prisma';
import { RecordController } from '../recordController';
import { AgentGraph } from './agentGraph';
import { AgentGraph as AgentGraphType } from './agentGraph.type';

export class AgentGraphController extends RecordController<AgentGraphType> {
    constructor(connection: PrismaConnection) {
        super('agentGraph', connection, data => new AgentGraph(this, data));
    }
}
