import { PrismaConnection } from '@abyss/records';
import { StateMachineExecution } from './state-machine-execution';
import { GraphNodeDefinition, PortDataType } from './type-definition.type';

export interface PortTriggerData<T> {
    portId: string;
    dataType: PortDataType;
    inputValue: T;
}

export interface ResolveNodeData {
    execution: StateMachineExecution;
    node: GraphNodeDefinition;
    portData: PortTriggerData<any>[];
    resolvePort<T>(portId: string): T;
    parameters: Record<string, any>;
    database: PrismaConnection;
}

export interface NodeExecutionResult {
    portData: PortTriggerData<any>[];
}
