import { ImageModel } from '../../interfaces/image';
import { ImagineProps } from '../types';

export async function imagineImageModel(imageModel: ImageModel, props: ImagineProps) {
    return {
        prompt: props.prompt,
        response: await imageModel.generate({
            prompt: props.prompt,
        }),
    };
}
