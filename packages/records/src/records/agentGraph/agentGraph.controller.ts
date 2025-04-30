import { PrismaConnection } from '../../prisma';
import { RecordController } from '../recordController';
import { AgentGraphRecord } from './agentGraph';
import { AgentGraphType } from './agentGraph.type';

export class AgentGraphController extends RecordController<'agentGraph', AgentGraphType, AgentGraphRecord> {
    constructor(connection: PrismaConnection) {
        super(
            'agentGraph',
            'a graph of nodes and edges representing an agent graph that can be executed',
            connection,
            data => new AgentGraphRecord(this, data)
        );
    }
}
