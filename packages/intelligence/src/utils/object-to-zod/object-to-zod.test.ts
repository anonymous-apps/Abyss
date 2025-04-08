import { describe, expect, it } from 'vitest';
import { createZodFromObject } from './object-to-zod';

describe('object-to-zod', () => {
    describe('createZodFromObject', () => {
        it('should create a Zod object schema from a Record<string, string>', () => {
            const input = {
                name: 'The name of the person',
                age: 'The age of the person in years',
                email: 'The email address of the person',
            };

            const schema = createZodFromObject(input);

            // Verify the schema has the correct shape
            expect(schema.shape).toHaveProperty('name');
            expect(schema.shape).toHaveProperty('age');
            expect(schema.shape).toHaveProperty('email');

            // Verify each field is a ZodString with the correct description
            expect(schema.shape.name._def.description).toBe('The name of the person');
            expect(schema.shape.age._def.description).toBe('The age of the person in years');
            expect(schema.shape.email._def.description).toBe('The email address of the person');

            // Verify the schema can parse valid data
            const validData = {
                name: 'John Doe',
                age: '30',
                email: 'john@example.com',
            };

            const result = schema.parse(validData);
            expect(result).toEqual(validData);
        });

        it('should handle empty objects', () => {
            const input = {};
            const schema = createZodFromObject(input);

            // Verify the schema has no properties
            expect(Object.keys(schema.shape)).toHaveLength(0);

            // Verify the schema can parse empty objects
            const result = schema.parse({});
            expect(result).toEqual({});
        });
    });
});
