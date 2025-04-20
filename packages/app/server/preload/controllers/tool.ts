import { BaseDatabaseConnection, BaseRecord } from './_base';

export interface ToolRecord extends BaseRecord {
    name: string;
    description: string;
    type: string;
    schema: Record<string, any>;
    data?: Record<string, any>;
}

class _ToolController extends BaseDatabaseConnection<ToolRecord> {
    constructor() {
        super('tool', 'Building blocks for agents that represent possible actions with parameters');
    }

    async createIfMissing(params: Omit<ToolRecord, 'id' | 'createdAt' | 'updatedAt'>) {
        const existing = await this.findFirst({ where: { type: params.type } });
        if (existing) {
            return existing;
        }
        return this.create(params);
    }
}

export const ToolController = new _ToolController();
