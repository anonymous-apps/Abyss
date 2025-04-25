export interface GraphPortData {
    id: string;
    type: 'data' | 'signal';
    dataType: 'string' | 'number' | 'boolean' | 'thread' | 'language-model' | 'chat';
    name: string;
    description: string;
}

export class GraphPort {
    public readonly id: string;
    public readonly type: 'data' | 'signal';
    public readonly dataType: 'string' | 'number' | 'boolean' | 'thread' | 'language-model' | 'chat';
    public readonly name: string;
    public readonly description: string;

    constructor(data: GraphPortData) {
        this.id = data.id;
        this.type = data.type;
        this.dataType = data.dataType;
        this.name = data.name;
        this.description = data.description;
    }
}
