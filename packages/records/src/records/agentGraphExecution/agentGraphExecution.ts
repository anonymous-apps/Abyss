import { safeSerialize } from '../../utils/serialization';
import { RecordClass } from '../recordClass';
import { Status } from '../shared.type';
import { AgentGraphExecutionController } from './agentGraphExecution.controller';
import { AgentGraphExecutionType } from './agentGraphExecution.type';
import { StateMachineEvent } from './agentGraphExecutionEvents.type';

export class AgentGraphExecutionRecord extends RecordClass<AgentGraphExecutionType> {
    public agentGraphId: string;
    public status: Status;
    public events: StateMachineEvent[];
    public startTime: Date;
    public endTime: Date;

    constructor(controller: AgentGraphExecutionController, data: AgentGraphExecutionType) {
        super(controller, data);
        this.agentGraphId = data.agentGraphId;
        this.status = data.status;
        this.events = data.events;
        this.startTime = data.startTime;
        this.endTime = data.endTime;
    }

    public getEvents(): StateMachineEvent[] {
        return this.events;
    }

    public async beginExecution(): Promise<void> {
        this.status = 'inProgress';
        this.startTime = new Date();
        this.events.push({
            type: 'execution-began',
            executionId: this.id,
        });
        await this.save();
    }

    public async beginNodeResolution(nodeId: string, nodeType: string, inputs: Record<string, any>): Promise<void> {
        this.events.push({
            type: 'node-resolution-began',
            executionId: this.id,
            nodeId,
            nodeType,
            inputs: safeSerialize(inputs),
            timestamp: new Date(),
        });
        await this.save();
    }

    public async completeNodeResolution(nodeId: string, nodeType: string, outputs: Record<string, any>): Promise<void> {
        this.events.push({
            type: 'node-resolution-completed',
            executionId: this.id,
            nodeId,
            nodeType,
            outputs: safeSerialize(outputs),
            timestamp: new Date(),
        });
        await this.save();
    }

    public async failNodeResolution(nodeId: string, nodeType: string, error: string, stack: string | undefined): Promise<void> {
        this.events.push({
            type: 'node-resolution-failed',
            executionId: this.id,
            nodeId,
            nodeType,
            error: safeSerialize(error),
            stack: safeSerialize(stack),
            timestamp: new Date(),
        });
        await this.save();
    }

    public async completeExecution(): Promise<void> {
        this.status = 'completed';
        this.endTime = new Date();
        this.events.push({
            type: 'execution-completed',
            executionId: this.id,
        });
        await this.save();
    }

    public async failExecution(error: string, stack: string | undefined): Promise<void> {
        this.status = 'failed';
        this.endTime = new Date();
        this.events.push({
            type: 'execution-failed',
            executionId: this.id,
            error: safeSerialize(error),
            stack: safeSerialize(stack),
        });
        await this.save();
    }
}
