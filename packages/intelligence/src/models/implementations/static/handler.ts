import type { InvokeModelInternalResult } from '../../types';
import type { StaticLanguageModelOptions } from './types';

export async function InvokeStatic(props: StaticLanguageModelOptions): Promise<Omit<InvokeModelInternalResult, 'logStream'>> {
    return {
        inputRaw: [],
        outputRaw: props.response,
        outputString: props.response,
        metrics: {},
    };
}
