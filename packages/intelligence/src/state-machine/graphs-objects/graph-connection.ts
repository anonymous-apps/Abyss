export interface GraphConnectionData {
    id: string;
    sourceNodeId: string;
    sourcePortId: string;
    targetNodeId: string;
    targetPortId: string;
}

export class GraphConnection {
    public readonly id: string;
    public readonly sourceNodeId: string;
    public readonly targetNodeId: string;
    public readonly sourcePortId: string;
    public readonly targetPortId: string;

    constructor(data: GraphConnectionData) {
        this.id = data.id;
        this.sourceNodeId = data.sourceNodeId;
        this.targetNodeId = data.targetNodeId;
        this.sourcePortId = data.sourcePortId;
        this.targetPortId = data.targetPortId;
    }
}
