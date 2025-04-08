/**
 * Utils for converting JavaScript objects to Zod schemas
 */
import { z } from 'zod';

/**
 * @description Converts a Record<string, string> to a Zod object schema where each key is a field
 * and each value is used as the description for that field.
 *
 * @param obj The Record<string, string> to convert
 * @returns A Zod object schema
 *
 * @example
 * const schema = createZodFromObject({
 *   name: "The name of the person",
 *   age: "The age of the person in years"
 * });
 * // Result: z.object({
 * //   name: z.string().describe("The name of the person"),
 * //   age: z.string().describe("The age of the person in years")
 * // })
 */
export function createZodFromObject(obj: Record<string, string>): z.ZodObject<any> {
    const shape: Record<string, z.ZodString> = {};

    for (const [key, description] of Object.entries(obj)) {
        shape[key] = z.string().describe(description);
    }

    return z.object(shape);
}
