import { ImageModel, ImageModelInput, ImageModelResponse, ImageModelProps } from '../../interfaces/image';

export interface MockedImageModelOptions extends ImageModelProps {
    responses: string[];
}

export class MockedImageModel extends ImageModel {
    private responses: string[];

    constructor(props: MockedImageModelOptions) {
        super(props);
        this.responses = props.responses;
    }

    public override getName(): string {
        return 'mocked-image';
    }

    protected override async handleInvoke(input: ImageModelInput): Promise<ImageModelResponse> {
        return {
            imageBase64: this.responses.shift() || '',
        };
    }
}
