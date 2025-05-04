import { Status } from '../../utils/shared.type';
import { BaseRecordProps } from '../recordClass';
import { StateMachineEvent } from './agentGraphExecutionEvents.type';

export interface AgentGraphExecutionType extends BaseRecordProps {
    agentGraphId: string;
    status: Status;
    events: StateMachineEvent[];
    startTime?: string;
    endTime?: string;
}
