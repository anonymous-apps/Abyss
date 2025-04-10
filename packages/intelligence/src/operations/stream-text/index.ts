import { StreamedChatResponse } from '../../constructs/streamed-chat-response/chat-response';
import { Log } from '../../utils/logs';
import { StreamTextOptions } from './types';

export * from './errors';
export * from './types';

export async function streamText(options: StreamTextOptions): Promise<StreamedChatResponse> {
    const { model, thread } = options;
    Log.log('streamText', `Starting text stream against model ${model.getName()}`);

    // Call stream against model
    Log.log('streamText', `Streaming response from model ${model.getName()} . . .`);
    const stream = await model.stream(thread);
    const response = new StreamedChatResponse({ model, inputThread: thread });

    // Stream to chat response directly
    (async () => {
        for await (const message of stream) {
            response.addText(message);
            response.addTextToCurrentTextMessage(message);
        }
        response.complete();
    })();

    return response;
}
