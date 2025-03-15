import { BaseDatabaseConnection, BaseRecord } from './_base';
import { prisma } from '../database-connection';

export interface AgentToolConnectionRecord extends BaseRecord {
    agentId: string;
    toolId: string;
    permission: string;
}

class _AgentToolConnectionController extends BaseDatabaseConnection<AgentToolConnectionRecord> {
    constructor() {
        super('agentToolConnection', 'Associated which tools are available to which agents');
    }

    async findByAgentId(agentId: string): Promise<AgentToolConnectionRecord[]> {
        const result = await this.getTable().findMany({
            where: { agentId },
        });
        return result as AgentToolConnectionRecord[];
    }

    async findByToolId(toolId: string): Promise<AgentToolConnectionRecord[]> {
        const result = await this.getTable().findMany({
            where: { toolId },
        });
        return result as AgentToolConnectionRecord[];
    }
}

export const AgentToolConnectionController = new _AgentToolConnectionController();
