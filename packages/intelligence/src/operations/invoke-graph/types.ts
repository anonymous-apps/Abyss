import { DataInterface } from '../../constructs';
import { GraphInputEvent } from '../../state-machine';

export interface InvokeGraphParams {
    db: DataInterface;
    graphId: string;
    input: GraphInputEvent;
}
