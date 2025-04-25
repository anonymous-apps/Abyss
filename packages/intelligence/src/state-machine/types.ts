import { GraphNodeDefinition } from '../constructs/graphs/graph-node';
import { StateMachineExecution } from './state-machine-execution';

export interface PortTriggerData {
    portId: string;
    dataType: 'string' | 'number' | 'boolean';
    inputValue: string | number | boolean;
}

export interface ResolveNodeData {
    execution: StateMachineExecution;
    node: GraphNodeDefinition;
    portData: PortTriggerData[];
}

export interface NodeExecutionResult {
    portData: PortTriggerData[];
}
