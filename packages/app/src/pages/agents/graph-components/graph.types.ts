import { GraphNodeDefinition } from '@abyss/intelligence';

export interface RenderedGraphNode {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: {
        label: string;
        definition: GraphNodeDefinition;
    };
}
