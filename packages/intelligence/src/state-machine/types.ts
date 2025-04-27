import { DataInterface } from '../constructs';
import { GraphNodeDefinition } from './graphs-objects/graph-node';
import { StateMachineExecution } from './state-machine-execution';

export type PortDataType = 'string' | 'number' | 'boolean' | 'thread' | 'chat-model' | 'chat';

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
    db: DataInterface;
}

export interface NodeExecutionResult {
    portData: PortTriggerData<any>[];
}

export interface GraphInputEventOnUserChat {
    type: 'onUserChat';
    chatId: string;
}

export type GraphInputEvent = GraphInputEventOnUserChat;
