import { safeSerialize } from '../../utils/serialization';
import { ReferencedDatabaseRecord } from '../recordClass';
import { AgentGraphExecutionController } from './agentGraphExecution.controller';
import { AgentGraphExecutionType } from './agentGraphExecution.type';
import {
    BaseEvent,
    ExecutionBeganEvent,
    ExecutionCompletedEvent,
    ExecutionFailedEvent,
    ExecutionInfoEvent,
    NodeResolutionBeganEvent,
    NodeResolutionCompletedEvent,
    NodeResolutionFailedEvent,
    StateMachineEvent,
} from './agentGraphExecutionEvents.type';

export class AgentGraphExecutionRecord extends ReferencedDatabaseRecord<AgentGraphExecutionType> {
    constructor(controller: AgentGraphExecutionController, id: string) {
        super(controller, id);
    }

    public async getEvents(): Promise<StateMachineEvent[]> {
        const data = await this.getOrThrow();
        return data.events ?? [];
    }

    private async addEvent(event: Omit<BaseEvent, 'timestamp' | 'executionId'>): Promise<void> {
        const data = await this.getOrThrow();
        await this.update({
            events: [
                ...(data.events ?? []),
                {
                    ...event,
                    timestamp: new Date().toISOString(),
                    executionId: this.id,
                } as StateMachineEvent,
            ],
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
        await this.update({
            startTime: new Date().toISOString(),
            status: 'inProgress',
        });
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
