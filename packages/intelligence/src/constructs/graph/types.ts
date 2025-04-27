import { GraphNodeDefinition } from '../..';

import { GraphConnection } from '../..';

export interface GraphProps {
    id: string;
    name: string;
    nodes: GraphNodeDefinition[];
    connections: GraphConnection[];
}
