import { BaseDatabaseConnection, BaseRecord } from './_base';

export interface AgentRecord extends BaseRecord {
    name: string;
    description: string;
    graph: AgentGraphRecord;
}

export interface AgentGraphRecord {
    nodes: {
        id: string;
        type: string;
        position: {
            x: number;
            y: number;
        };
    }[];
    edges: {
        id: string;
        sourceNode: string;
        sourceHandle: string;
        targetNode: string;
        targetHandle: string;
    }[];
}

class _AgentController extends BaseDatabaseConnection<AgentRecord> {
    constructor() {
        super('agent', 'Agents are what you get when you allow a chat model to use tools');
    }
}

export const AgentController = new _AgentController();
