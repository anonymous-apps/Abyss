import { BaseRecordProps } from '../recordClass';
import { Status } from '../shared.type';
import { StateMachineEvent } from './agentGraphExecutionEvents.type';

export interface AgentGraphExecutionType extends BaseRecordProps {
    agentGraphId: string;
    status: Status;
    events: StateMachineEvent[];
    startTime?: string;
    endTime?: string;
}
