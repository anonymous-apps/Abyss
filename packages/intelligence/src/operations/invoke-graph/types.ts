import type { SQliteClient } from '@abyss/records';
import type { GraphInputEvent } from '../../state-machine/type-input.type';

export interface InvokeGraphParams {
    graphId: string;
    input: GraphInputEvent;
    database: SQliteClient;
}
