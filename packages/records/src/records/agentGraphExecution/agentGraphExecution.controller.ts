import { PrismaConnection } from '../../prisma';
import { RecordController } from '../recordController';
import { AgentGraphExecutionRecord } from './agentGraphExecution';
import { AgentGraphExecutionType } from './agentGraphExecution.type';

export class AgentGraphExecutionController extends RecordController<
    'agentGraphExecution',
    AgentGraphExecutionType,
    AgentGraphExecutionRecord
> {
    constructor(connection: PrismaConnection) {
        super(
            'agentGraphExecution',
            'an execution of an agent graph, outputs and logs',
            connection,
            (data: any) => new AgentGraphExecutionRecord(this, data)
        );
    }

    async new(agentGraphId: string): Promise<AgentGraphExecutionRecord> {
        const result = await this.connection.client.agentGraphExecution.create({
            data: {
                agentGraphId,
            },
        });
        this.connection.notifyRecord(this.recordType, result);
        return new AgentGraphExecutionRecord(this, result as unknown as AgentGraphExecutionType);
    }
}
