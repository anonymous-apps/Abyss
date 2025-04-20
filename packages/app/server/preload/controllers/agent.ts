import { BaseDatabaseConnection, BaseRecord } from './_base';

export interface AgentRecord extends BaseRecord {
    name: string;
    description: string;
    chatModelId: string;
    systemPromptId?: string;
}

class _AgentController extends BaseDatabaseConnection<AgentRecord> {
    constructor() {
        super('agent', 'Agents are what you get when you allow a chat model to use tools');
    }
}

export const AgentController = new _AgentController();
