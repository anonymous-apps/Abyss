import { RecordClass } from '../recordClass';
import { RecordController } from '../recordController';
import { AgentGraphEdge, AgentGraphNode, AgentGraph as AgentGraphType } from './agentGraph.type';

export class AgentGraph extends RecordClass<AgentGraphType> {
    public name: string;
    public description: string;
    public nodes: AgentGraphNode[];
    public edges: AgentGraphEdge[];

    constructor(controller: RecordController<AgentGraphType>, data: AgentGraphType) {
        super(controller, data);
        this.name = data.name;
        this.description = data.description;
        this.nodes = data.nodes;
        this.edges = data.edges;
    }
}
