import { GraphConnection } from '../../state-machine/graphs-objects/graph-connection';
import { GraphNodeDefinition } from '../../state-machine/graphs-objects/graph-node';

export interface GraphProps {
    id?: string;
    name?: string;
    description?: string;
    nodes?: GraphNodeDefinition[];
    connections?: GraphConnection[];
    nodeParameters?: Record<string, Record<string, any>>;
}
