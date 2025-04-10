import { AsyncStream } from '../../constructs';
import { Log } from '../logs';

/**
 * Generic stream parser for handling different streaming formats
 * @param reader The ReadableStreamDefaultReader
 * @param decoder TextDecoder for decoding chunks
 * @param modelName The name of the model for logging purposes
 * @param parseChunk Function to parse each chunk of data
 * @returns AsyncStream of parsed data
 */
export async function createGenericStreamParser<T>(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    decoder: TextDecoder,
    modelName: string,
    parseChunk: (chunk: string) => T | null
): Promise<AsyncStream<T>> {
    const stream = new AsyncStream<T>();

    (async () => {
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                const result = parseChunk(chunk);

                if (result !== null) {
                    stream.push(result);
                }
            }
            stream.close();
        } catch (error) {
            Log.error(modelName, `Stream parsing error: ${error}`);
            stream.setError(error as Error);
        }
    })();

    return stream;
}

/**
 * Parse Server-Sent Events (SSE) format
 * @param data The raw data string
 * @returns Parsed data or null if not valid
 */
export function parseSSE(data: string): string | null {
    if (data.startsWith('data: ')) {
        const content = data.slice(6).trim();

        // Skip [DONE] messages
        if (content === '[DONE]') {
            return null;
        }

        return content;
    }

    return null;
}

/**
 * Parse JSON from a string
 * @param data The JSON string
 * @returns Parsed JSON object or null if parsing fails
 */
export function parseJSON<T>(data: string): T | null {
    try {
        return JSON.parse(data) as T;
    } catch (error) {
        return null;
    }
}
