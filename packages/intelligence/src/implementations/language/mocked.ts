import { LanguageModel, LanguageModelInvokeProps, LanguageModelResponse } from '../../interfaces/language';

export interface MockedLLMOptions {
    responses: string[];
}

export class MockedLLM extends LanguageModel {
    constructor(private props: MockedLLMOptions) {
        super();
    }

    public override getName(): string {
        return 'mocked';
    }

    protected override async handleInvoke(props: LanguageModelInvokeProps): Promise<LanguageModelResponse> {
        return {
            response: this.props.responses.shift() || '',
        };
    }
}
