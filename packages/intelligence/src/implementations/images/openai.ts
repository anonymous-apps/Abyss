import { ImageModel, ImageModelInput, ImageModelResponse, ImageModelProps } from '../../interfaces/image';

export interface OpenAIImageModelOptions extends ImageModelProps {
    apiKey?: string;
    modelId?: string;
}

export class OpenAIImageModel extends ImageModel {
    private modelId = 'dall-e-3';
    private apiKey: string;

    constructor(props: OpenAIImageModelOptions = {}) {
        super(props);
        this.apiKey = props.apiKey || (process && process.env.OPENAI_API_KEY) || '';
        this.modelId = props.modelId || this.modelId;
    }

    public override getName(): string {
        return 'openai-' + this.modelId;
    }

    protected override async handleInvoke(input: ImageModelInput): Promise<ImageModelResponse> {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.apiKey}`,
            },
            method: 'POST',
            body: JSON.stringify({
                model: this.modelId,
                prompt: input.prompt,
                size: '1024x1024',
                quality: 'hd',
                response_format: 'b64_json',
            }),
        });

        const responseJson = await response.json();

        if (!responseJson.data || !responseJson.data[0].b64_json) {
            throw new Error('No image generated: ' + JSON.stringify(responseJson));
        }

        return {
            imageBase64: responseJson.data[0].b64_json,
        };
    }
}
