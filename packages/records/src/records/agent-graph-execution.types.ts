import { BaseSqliteRecord } from '../sqlite/sqlite.type';
import { Status } from '../utils/shared.type';

export interface BaseEvent {
    level: 'info' | 'error';
    timestamp: string;
    executionId: string;
    message: string;
}

export interface ExecutionBeganEvent extends BaseEvent {
    type: 'execution-began';
    eventType: string;
    eventData: Record<string, any>;
}

export interface ExecutionInfoEvent extends BaseEvent {
    type: 'execution-info';
    eventData: Record<string, any>;
}

export interface NodeResolutionBeganEvent extends BaseEvent {
    type: 'node-resolution-began';
    nodeId: string;
    nodeType: string;
    inputs: Record<string, any>;
}

export interface NodeResolutionCompletedEvent extends BaseEvent {
    type: 'node-resolution-completed';
    nodeId: string;
    nodeType: string;
    outputs: Record<string, any>;
}

export interface NodeResolutionFailedEvent extends BaseEvent {
    type: 'node-resolution-failed';
    nodeType: string;
    nodeId: string;
    error: string;
    stack: string | undefined;
}

export interface ExecutionCompletedEvent extends BaseEvent {
    type: 'execution-completed';
}

export interface ExecutionFailedEvent extends BaseEvent {
    type: 'execution-failed';
    error: string;
    stack: string | undefined;
}

export type StateMachineEvent =
    | ExecutionBeganEvent
    | ExecutionInfoEvent
    | NodeResolutionBeganEvent
    | NodeResolutionCompletedEvent
    | NodeResolutionFailedEvent
    | ExecutionCompletedEvent
    | ExecutionFailedEvent;

export interface AgentGraphExecutionType extends BaseSqliteRecord {
    agentGraphId: string;
    status: Status;
    events: StateMachineEvent[];
    startTime?: string;
    endTime?: string;
}
