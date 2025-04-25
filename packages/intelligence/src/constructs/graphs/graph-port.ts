export interface GraphPortData {
    id: string;
    type: 'data' | 'signal';
    dataType: 'string' | 'number' | 'boolean';
    name: string;
}

export class GraphPort {
    public readonly id: string;
    public readonly type: 'data' | 'signal';

    constructor(data: GraphPortData) {
        this.id = data.id;
        this.type = data.type;
    }
}
