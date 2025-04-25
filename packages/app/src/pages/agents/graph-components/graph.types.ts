import { GraphNodeDefinition } from '@abyss/intelligence';

export interface RenderedGraphNode {
    id: string;
    definition: GraphNodeDefinition;
    position: { x: number; y: number };
    data: {
        label: string;
    };
}
