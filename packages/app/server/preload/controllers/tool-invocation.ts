import { BaseDatabaseConnection, BaseRecord } from './_base';

export interface ToolInvocationRecord extends BaseRecord {
    toolId: string;
    parameters: Record<string, any>;
    result?: Record<string, any>;
    textLogId?: string;
    status: 'idle' | 'running' | 'complete' | 'failed';
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

    async complete(id: string, result: Record<string, any>): Promise<ToolInvocationRecord> {
        return await this.update(id, {
            result,
            status: 'complete',
        });
    }

    async error(id: string, errorMessage: string): Promise<ToolInvocationRecord> {
        return await this.update(id, {
            result: { error: errorMessage },
            status: 'failed',
        });
    }
}

export const ToolInvocationController = new _ToolInvocationController();
