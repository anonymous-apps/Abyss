/**
 * Utils for converting JavaScript objects to Zod schemas
 */
import { z } from 'zod';

/**
 * @description Converts a Record<string, string | Record<string, any>> to a Zod object schema where each key is a field
 * and each value is either a string (used as description) or another object (processed recursively).
 *
 * @param obj The Record<string, string | Record<string, any>> to convert
 * @returns A Zod object schema
 *
 * @example
 * const schema = createZodFromObject({
 *   name: "The name of the person",
 *   age: "The age of the person in years",
 *   address: {
 *     street: "The street address",
 *     city: "The city name"
 *   }
 * });
 * // Result: z.object({
 * //   name: z.string().describe("The name of the person"),
 * //   age: z.string().describe("The age of the person in years"),
 * //   address: z.object({
 * //     street: z.string().describe("The street address"),
 * //     city: z.string().describe("The city name")
 * //   })
 * // })
 */
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
