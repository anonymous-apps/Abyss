import { PortTriggerData } from './types';

export interface ExecutionBeganEvent {
    type: 'execution-began';
    executionId: string;
}

export interface NodeResolutionBeganEvent {
    type: 'node-resolution-began';
    executionId: string;
    nodeId: string;
    inputs: PortTriggerData[];
}

export interface NodeResolutionCompletedEvent {
    type: 'node-resolution-completed';
    executionId: string;
    nodeId: string;
    outputs: PortTriggerData[];
}

export interface NodeResolutionFailedEvent {
    type: 'node-resolution-failed';
    executionId: string;
    nodeId: string;
    error: string;
    stack: string | undefined;
}

export interface ExecutionCompletedEvent {
    type: 'execution-completed';
    executionId: string;
}

export interface ExecutionFailedEvent {
    type: 'execution-failed';
    executionId: string;
    error: string;
    stack: string | undefined;
}

export type StateMachineEvent =
    | ExecutionBeganEvent
    | NodeResolutionBeganEvent
    | NodeResolutionCompletedEvent
    | NodeResolutionFailedEvent
    | ExecutionCompletedEvent
    | ExecutionFailedEvent;
