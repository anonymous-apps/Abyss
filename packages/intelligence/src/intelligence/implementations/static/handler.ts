import { StaticLanguageModelOptions } from './types';

export async function InvokeStatic(props: StaticLanguageModelOptions) {
    return {
        inputContext: [],
        response: props.intelligence.props.data.response,
        metrics: {},
    };
}
