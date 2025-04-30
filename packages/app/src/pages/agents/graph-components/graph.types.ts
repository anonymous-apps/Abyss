import { GraphNodeDefinition } from '@abyss/intelligence/dist/state-machine/type-definition.type';
import { AgentGraphNode } from '@abyss/records';

export interface RenderedGraphNode {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: {
        label: string;
        definition: GraphNodeDefinition;
        database: AgentGraphNode;
    };
}
