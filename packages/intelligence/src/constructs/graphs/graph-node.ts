import { GraphPortData } from './graph-port';

export interface GraphNodeData {
    id: string;
    icon: string;
    type: string;
    name: string;
    description: string;
    color: string;
    inputPorts: Record<string, GraphPortData>;
    outputPorts: Record<string, GraphPortData>;
}

export class GraphNodeDefinition {
    public readonly id: string;
    public readonly icon: string;
    public readonly type: string;
    public readonly name: string;
    public readonly description: string;
    public readonly color: string;
    public readonly inputPorts: Record<string, GraphPortData>;
    public readonly outputPorts: Record<string, GraphPortData>;

    constructor(data: GraphNodeData) {
        this.id = data.id;
        this.icon = data.icon;
        this.type = data.type;
        this.name = data.name;
        this.description = data.description;
        this.color = data.color;
        this.inputPorts = data.inputPorts;
        this.outputPorts = data.outputPorts;
    }
}
