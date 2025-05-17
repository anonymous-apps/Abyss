import type { Meta, StoryObj } from '@storybook/react';
import { LabelValue } from './LabelValue';

// Meta information for the component
const meta: Meta<typeof LabelValue> = {
    title: 'Data/LabelValue',
    component: LabelValue,
    parameters: {
        layout: 'padded',
    },
    decorators: [
        Story => (
            <div style={{ maxWidth: '400px' }}>
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof LabelValue>;

// Basic example
export const Basic: Story = {
    args: {
        data: {
            name: 'John Doe',
            email: 'john@example.com',
            role: 'Administrator',
            status: 'Active',
        },
    },
};

// With complex data
export const ComplexData: Story = {
    args: {
        data: {
            name: 'Project Alpha',
            description: 'This is a long description of Project Alpha that might wrap to multiple lines when displayed in the component.',
            status: 'In Progress',
            startDate: '2023-05-15',
            owner: 'Jane Smith',
            team: ['John', 'Sarah', 'Mike'],
            metrics: { completion: '65%', budget: '$12,000', risk: 'Low' },
        },
    },
};

// With ignored keys
export const WithIgnoredKeys: Story = {
    args: {
        data: {
            id: 'user-123',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            createdAt: '2023-01-15',
            updatedAt: '2023-06-22',
            role: 'Editor',
            status: 'Active',
        },
        ignoreKeys: ['id', 'createdAt', 'updatedAt'],
    },
};

// With React nodes as values
export const WithReactNodes: Story = {
    args: {
        data: {
            name: 'Product X',
            description: 'Premium wireless headphones with noise cancellation',
            price: <span className="font-bold text-primary-500 text-lg">$299.99</span>,
            inStock: <span className="py-1 px-2 bg-green-100 text-green-800 rounded-full text-xs inline-block">In Stock</span>,
            category: 'Electronics',
            tags: (
                <div className="flex flex-wrap gap-1 mt-1">
                    {['premium', 'new', 'featured'].map(tag => (
                        <span key={tag} className="bg-background-500 px-2 py-1 rounded text-text-100 text-xs">
                            {tag}
                        </span>
                    ))}
                </div>
            ),
            reviews: (
                <div className="flex items-center">
                    <span className="text-yellow-500">★★★★★</span>
                    <span className="ml-1">4.8/5</span>
                </div>
            ),
        },
    },
};
