import { SQliteClient } from '@abyss/records';
import { StateMachineExecution } from './state-machine-execution';
import { GraphDataType, GraphNodeDefinition } from './type-definition.type';

export interface PortTriggerData<T> {
    portId: string;
    dataType: GraphDataType;
    inputValue: T;
}

export interface ResolveNodeData {
    execution: StateMachineExecution;
    node: GraphNodeDefinition;
    portData: PortTriggerData<any>[];
    resolvePort<T>(portId: string): T;
    parameters: Record<string, any>;
    database: SQliteClient;
}

export interface NodeExecutionResult {
    portData: PortTriggerData<any>[];
}
