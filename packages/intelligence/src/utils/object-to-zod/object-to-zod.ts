/**
 * Utils for converting JavaScript objects to Zod schemas
 */
import { z } from 'zod';

export function createZodFromObject(obj: Record<string, string | Record<string, any>>): z.ZodObject<any> {
    const shape: Record<string, z.ZodTypeAny> = {};

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            // Handle string values (descriptions)
            shape[key] = z.string().describe(value);
        } else if (typeof value === 'object' && value !== null) {
            // Handle nested objects recursively
            shape[key] = createZodFromObject(value as Record<string, string | Record<string, any>>);
        }
    }

    return z.object(shape);
}
