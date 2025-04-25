import { BaseDatabaseConnection, BaseRecord } from './_base';

export interface ToolRecord extends BaseRecord {
    name: string;
    shortId: string;
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
        return this.create({
            ...params,
            shortId: params.name.toLowerCase().replace(/ /g, '-') + '-' + crypto.randomUUID().substring(0, 4),
        });
    }

    async findByShortId(shortId: string) {
        return this.findFirst({ where: { shortId } });
    }
}

export const ToolController = new _ToolController();
