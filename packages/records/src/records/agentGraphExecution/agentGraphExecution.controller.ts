import { PrismaConnection } from '../../prisma';
import { RecordController } from '../recordController';
import { AgentGraphExecutionRecord } from './agentGraphExecution';
import { AgentGraphExecutionType } from './agentGraphExecution.type';

export class AgentGraphExecutionController extends RecordController<AgentGraphExecutionType> {
    constructor(connection: PrismaConnection) {
        super('agentGraphExecution', connection, (data: any) => new AgentGraphExecutionRecord(this, data));
    }
}
