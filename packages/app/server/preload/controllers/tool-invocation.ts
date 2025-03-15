import { BaseDatabaseConnection, BaseRecord } from './_base';
import { prisma } from '../database-connection';

export interface ToolInvocationRecord extends BaseRecord {
    toolId: string;
    parameters: Record<string, any>;
    result?: Record<string, any>;
    textLogId?: string;
    status: string;
}

class _ToolInvocationController extends BaseDatabaseConnection<ToolInvocationRecord> {
    constructor() {
        super('toolInvocation', 'Records of all tool invocations with parameters and results');
    }

    async findByToolId(toolId: string): Promise<ToolInvocationRecord[]> {
        const result = await this.getTable().findMany({
            where: { toolId },
        });
        return result as ToolInvocationRecord[];
    }

    async findByStatus(status: string): Promise<ToolInvocationRecord[]> {
        const result = await this.getTable().findMany({
            where: { status },
        });
        return result as ToolInvocationRecord[];
    }
}

export const ToolInvocationController = new _ToolInvocationController();
