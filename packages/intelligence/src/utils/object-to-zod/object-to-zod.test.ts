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

        it('should handle nested objects', () => {
            const input = {
                name: 'The name of the person',
                address: {
                    street: 'The street address',
                    city: 'The city name',
                    country: 'The country name',
                },
                contact: {
                    email: 'The email address',
                    phone: 'The phone number',
                },
            };

            const schema = createZodFromObject(input);

            // Verify the schema has the correct shape
            expect(schema.shape).toHaveProperty('name');
            expect(schema.shape).toHaveProperty('address');
            expect(schema.shape).toHaveProperty('contact');

            // Verify the top-level string field
            expect(schema.shape.name._def.description).toBe('The name of the person');

            // Verify nested objects
            expect(schema.shape.address._def.shape).toHaveProperty('street');
            expect(schema.shape.address._def.shape).toHaveProperty('city');
            expect(schema.shape.address._def.shape).toHaveProperty('country');

            expect(schema.shape.contact._def.shape).toHaveProperty('email');
            expect(schema.shape.contact._def.shape).toHaveProperty('phone');

            // Verify descriptions in nested objects
            expect(schema.shape.address._def.shape.street._def.description).toBe('The street address');
            expect(schema.shape.address._def.shape.city._def.description).toBe('The city name');
            expect(schema.shape.address._def.shape.country._def.description).toBe('The country name');

            expect(schema.shape.contact._def.shape.email._def.description).toBe('The email address');
            expect(schema.shape.contact._def.shape.phone._def.description).toBe('The phone number');

            // Verify the schema can parse valid data
            const validData = {
                name: 'John Doe',
                address: {
                    street: '123 Main St',
                    city: 'New York',
                    country: 'USA',
                },
                contact: {
                    email: 'john@example.com',
                    phone: '123-456-7890',
                },
            };

            const result = schema.parse(validData);
            expect(result).toEqual(validData);
        });

        it('should handle deeply nested objects', () => {
            const input = {
                person: {
                    name: 'The name of the person',
                    details: {
                        age: 'The age of the person',
                        address: {
                            street: 'The street address',
                            city: 'The city name',
                        },
                    },
                },
            };

            const schema = createZodFromObject(input);

            // Verify the schema has the correct shape
            expect(schema.shape).toHaveProperty('person');
            expect(schema.shape.person._def.shape).toHaveProperty('name');
            expect(schema.shape.person._def.shape).toHaveProperty('details');
            expect(schema.shape.person._def.shape.details._def.shape).toHaveProperty('age');
            expect(schema.shape.person._def.shape.details._def.shape).toHaveProperty('address');
            expect(schema.shape.person._def.shape.details._def.shape.address._def.shape).toHaveProperty('street');
            expect(schema.shape.person._def.shape.details._def.shape.address._def.shape).toHaveProperty('city');

            // Verify descriptions in deeply nested objects
            expect(schema.shape.person._def.shape.name._def.description).toBe('The name of the person');
            expect(schema.shape.person._def.shape.details._def.shape.age._def.description).toBe('The age of the person');
            expect(schema.shape.person._def.shape.details._def.shape.address._def.shape.street._def.description).toBe('The street address');
            expect(schema.shape.person._def.shape.details._def.shape.address._def.shape.city._def.description).toBe('The city name');

            // Verify the schema can parse valid data
            const validData = {
                person: {
                    name: 'John Doe',
                    details: {
                        age: '30',
                        address: {
                            street: '123 Main St',
                            city: 'New York',
                        },
                    },
                },
            };

            const result = schema.parse(validData);
            expect(result).toEqual(validData);
        });
    });
});
