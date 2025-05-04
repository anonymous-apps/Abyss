import { ReferencedSqliteRecord } from '../sqlite/reference-record';
import { ReferencedSqliteTable } from '../sqlite/reference-table';
import { SQliteClient } from '../sqlite/sqlite-client';
import { safeSerialize } from '../utils/serialization';
import {
    AgentGraphExecutionType,
    BaseEvent,
    ExecutionBeganEvent,
    ExecutionCompletedEvent,
    ExecutionFailedEvent,
    ExecutionInfoEvent,
    NodeResolutionBeganEvent,
    NodeResolutionCompletedEvent,
    NodeResolutionFailedEvent,
    StateMachineEvent,
} from './agent-graph-execution.types';

export class ReferencedAgentGraphExecutionTable extends ReferencedSqliteTable<AgentGraphExecutionType> {
    constructor(client: SQliteClient) {
        super('agentGraphExecution', 'Execution state and events for an agent graph', client);
    }

    async new(agentGraphId: string): Promise<AgentGraphExecutionType> {
        const result = await this.client.tables.agentGraphExecution.create({
            agentGraphId,
            status: 'notStarted',
            events: [],
        });
        return result;
    }
}

export class ReferencedAgentGraphExecutionRecord extends ReferencedSqliteRecord<AgentGraphExecutionType> {
    private async addEvent(event: Omit<BaseEvent, 'timestamp' | 'executionId'>): Promise<void> {
        const data = await this.get();
        const newEvent = { ...event, timestamp: new Date().toISOString(), executionId: this.id } as StateMachineEvent;
        const newEvents = [...(data.events ?? []), newEvent];
        await this.update({
            events: newEvents,
        });
    }

    public async addExecutionInfo(message: string, data?: Record<string, any>): Promise<void> {
        const infoEvent: Omit<ExecutionInfoEvent, 'timestamp' | 'executionId'> = {
            type: 'execution-info',
            message,
            level: 'info',
            eventData: safeSerialize(data),
        };
        await this.addEvent(infoEvent);
    }

    public async beginExecution(eventType: string, eventData: any): Promise<void> {
        const startEvent: Omit<ExecutionBeganEvent, 'timestamp' | 'executionId'> = {
            type: 'execution-began',
            message: `Execution began for agent graph from ${eventType}`,
            eventType,
            eventData: safeSerialize(eventData),
            level: 'info',
        };
        await this.addEvent(startEvent);
    }

    public async beginNodeResolution(nodeId: string, nodeType: string, inputs: Record<string, any>): Promise<void> {
        const startEvent: Omit<NodeResolutionBeganEvent, 'timestamp' | 'executionId'> = {
            type: 'node-resolution-began',
            message: `Node resolution began for ${nodeId} (${nodeType})`,
            nodeId,
            nodeType,
            inputs: safeSerialize(inputs),
            level: 'info',
        };
        await this.addEvent(startEvent);
    }

    public async completeNodeResolution(nodeId: string, nodeType: string, outputs: Record<string, any>): Promise<void> {
        const completeEvent: Omit<NodeResolutionCompletedEvent, 'timestamp' | 'executionId'> = {
            type: 'node-resolution-completed',
            message: `Node resolution completed for ${nodeId} (${nodeType})`,
            nodeId,
            nodeType,
            outputs: safeSerialize(outputs),
            level: 'info',
        };
        await this.addEvent(completeEvent);
    }

    public async failNodeResolution(nodeId: string, nodeType: string, error: string, stack: string | undefined): Promise<void> {
        const failEvent: Omit<NodeResolutionFailedEvent, 'timestamp' | 'executionId'> = {
            type: 'node-resolution-failed',
            message: `Node resolution failed for ${nodeId} (${nodeType}), error: ${error}`,
            nodeId,
            nodeType,
            error: safeSerialize(error),
            stack: safeSerialize(stack),
            level: 'error',
        };
        await this.addEvent(failEvent);
    }

    public async completeExecution(): Promise<void> {
        const completeEvent: Omit<ExecutionCompletedEvent, 'timestamp' | 'executionId'> = {
            type: 'execution-completed',
            message: 'Execution completed',
            level: 'info',
        };
        await this.update({
            endTime: new Date().toISOString(),
            status: 'completed',
        });
        await this.addEvent(completeEvent);
    }

    public async failExecution(error: string, stack: string | undefined): Promise<void> {
        const failEvent: Omit<ExecutionFailedEvent, 'timestamp' | 'executionId'> = {
            type: 'execution-failed',
            message: `Execution failed, error: ${error}`,
            error: safeSerialize(error),
            stack: safeSerialize(stack),
            level: 'error',
        };
        await this.addEvent(failEvent);
        await this.update({
            endTime: new Date().toISOString(),
            status: 'failed',
        });
    }
}
