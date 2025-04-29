export interface ExecutionBeganEvent {
    type: 'execution-began';
    executionId: string;
}

export interface NodeResolutionBeganEvent {
    type: 'node-resolution-began';
    executionId: string;
    nodeId: string;
    nodeType: string;
    timestamp: Date;
    inputs: Record<string, any>;
}

export interface NodeResolutionCompletedEvent {
    type: 'node-resolution-completed';
    executionId: string;
    nodeId: string;
    nodeType: string;
    outputs: Record<string, any>;
    timestamp: Date;
}

export interface NodeResolutionFailedEvent {
    type: 'node-resolution-failed';
    executionId: string;
    nodeType: string;
    nodeId: string;
    error: string;
    stack: string | undefined;
    timestamp: Date;
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
