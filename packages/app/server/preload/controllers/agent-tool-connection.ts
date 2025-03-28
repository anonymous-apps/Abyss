import { BaseDatabaseConnection, BaseRecord } from './_base';
import { ToolController, ToolRecord } from './tool';

export interface AgentToolConnectionRecord extends BaseRecord {
    agentId: string;
    toolId: string;
    permission: string;
}

class _AgentToolConnectionController extends BaseDatabaseConnection<AgentToolConnectionRecord> {
    constructor() {
        super('agentToolConnection', 'Associated which tools are available to which agents');
    }

    async findByAgentId(agentId: string) {
        const results: { tool: ToolRecord; permission: string }[] = [];

        const result = await this.getTable().findMany({
            where: { agentId },
        });

        for (const record of result) {
            const tool = await ToolController.getByRecordId(record.toolId);
            if (tool) {
                results.push({ tool, permission: record.permission });
            }
        }

        return results;
    }

    async findByToolId(toolId: string): Promise<AgentToolConnectionRecord[]> {
        const result = await this.getTable().findMany({
            where: { toolId },
        });
        return result as AgentToolConnectionRecord[];
    }
}

export const AgentToolConnectionController = new _AgentToolConnectionController();
