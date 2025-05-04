import { SQliteClient } from '@abyss/records';
import { GraphInputEvent } from '../../state-machine/type-input.type';

export interface InvokeGraphParams {
    graphId: string;
    input: GraphInputEvent;
    database: SQliteClient;
}
