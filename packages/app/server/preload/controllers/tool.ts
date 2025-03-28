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

    
}

export const ToolController = new _ToolController();
