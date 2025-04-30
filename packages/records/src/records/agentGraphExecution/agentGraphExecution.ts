import { safeSerialize } from '../../utils/serialization';
import { ReferencedDatabaseRecord } from '../recordClass';
import { AgentGraphExecutionController } from './agentGraphExecution.controller';
import { AgentGraphExecutionType } from './agentGraphExecution.type';
import { StateMachineEvent } from './agentGraphExecutionEvents.type';

export class AgentGraphExecutionRecord extends ReferencedDatabaseRecord<AgentGraphExecutionType> {
    constructor(controller: AgentGraphExecutionController, id: string) {
        super(controller, id);
    }

    public async getEvents(): Promise<StateMachineEvent[]> {
        const data = await this.getOrThrow();
        return data.events ?? [];
    }

    public async beginExecution(): Promise<void> {
        const data = await this.getOrThrow();
        await this.update({
            status: 'inProgress',
            startTime: new Date(),
            events: [
                ...(data.events ?? []),
                {
                    type: 'execution-began',
                    executionId: this.id,
                },
            ],
        });
    }

    public async beginNodeResolution(nodeId: string, nodeType: string, inputs: Record<string, any>): Promise<void> {
        const data = await this.getOrThrow();
        await this.update({
            events: [
                ...(data.events ?? []),
                {
                    type: 'node-resolution-began',
                    executionId: this.id,
                    nodeId,
                    nodeType,
                    inputs: safeSerialize(inputs),
                    timestamp: new Date(),
                },
            ],
        });
    }

    public async completeNodeResolution(nodeId: string, nodeType: string, outputs: Record<string, any>): Promise<void> {
        const data = await this.getOrThrow();
        await this.update({
            events: [
                ...(data.events ?? []),
                {
                    type: 'node-resolution-completed',
                    executionId: this.id,
                    nodeId,
                    nodeType,
                    outputs: safeSerialize(outputs),
                    timestamp: new Date(),
                },
            ],
        });
    }

    public async failNodeResolution(nodeId: string, nodeType: string, error: string, stack: string | undefined): Promise<void> {
        const data = await this.getOrThrow();
        await this.update({
            events: [
                ...(data.events ?? []),
                {
                    type: 'node-resolution-failed',
                    executionId: this.id,
                    nodeId,
                    nodeType,
                    error: safeSerialize(error),
                    stack: safeSerialize(stack),
                    timestamp: new Date(),
                },
            ],
        });
    }

    public async completeExecution(): Promise<void> {
        const data = await this.getOrThrow();
        await this.update({
            status: 'completed',
            endTime: new Date(),
            events: [
                ...(data.events ?? []),
                {
                    type: 'execution-completed',
                    executionId: this.id,
                },
            ],
        });
    }

    public async failExecution(error: string, stack: string | undefined): Promise<void> {
        const data = await this.getOrThrow();
        await this.update({
            status: 'failed',
            endTime: new Date(),
            events: [
                ...(data.events ?? []),
                {
                    type: 'execution-failed',
                    executionId: this.id,
                    error: safeSerialize(error),
                    stack: safeSerialize(stack),
                },
            ],
        });
    }
}
