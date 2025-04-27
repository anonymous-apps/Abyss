import { Intelligence } from '../constructs';
import { Chat } from '../constructs/chat/chat';
import { Thread } from '../constructs/thread/thread';
import { GraphNodeDefinition } from './graphs-objects/graph-node';
import { StateMachineExecution } from './state-machine-execution';

export type PortDataType = 'string' | 'number' | 'boolean' | 'thread' | 'intelligence' | 'chat';

export interface PortTriggerData {
    portId: string;
    dataType: PortDataType;
    inputValue: string | number | boolean | Thread | Intelligence | Chat;
}

export interface ResolveNodeData {
    execution: StateMachineExecution;
    node: GraphNodeDefinition;
    portData: PortTriggerData[];
}

export interface NodeExecutionResult {
    portData: PortTriggerData[];
}

export interface GraphInputEventOnUserChat {
    type: 'onUserChat';
    chatId: string;
}

export type GraphInputEvent = GraphInputEventOnUserChat;
