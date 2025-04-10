import { Log } from '../logs';

/**
 * Generic fetch function for language model APIs
 * @param url The API endpoint URL
 * @param options Fetch options including headers, body, etc.
 * @param modelName The name of the model for logging purposes
 * @returns Response object
 */
export async function fetchWithErrorHandling(url: string, options: RequestInit, modelName: string): Promise<Response> {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(`API error: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
        }

        return response;
    } catch (error) {
        Log.error(modelName, `Fetch error: ${error}`);
        throw error;
    }
}

/**
 * Creates a streaming fetch request
 * @param url The API endpoint URL
 * @param options Fetch options including headers, body, etc.
 * @param modelName The name of the model for logging purposes
 * @returns Response object with streaming enabled
 */
export async function createStreamingFetch(url: string, options: RequestInit, modelName: string): Promise<Response> {
    // Ensure we're using streaming mode
    const streamingOptions = {
        ...options,
        method: 'POST',
    };

    return fetchWithErrorHandling(url, streamingOptions, modelName);
}
