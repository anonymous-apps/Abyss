import { Meta, StoryObj } from '@storybook/react';
import { Table } from './Table';

// Meta information for the component
const meta: Meta<typeof Table> = {
    title: 'Data/Table',
    component: Table,
    parameters: {
        layout: 'padded',
    },
    argTypes: {
        onRowClick: { action: 'row clicked' },
    },
};

export default meta;
type Story = StoryObj<typeof Table>;

// Sample data for the stories
const sampleData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', age: 28 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive', age: 34 },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'Active', age: 42 },
    { id: 4, name: 'Sara Williams', email: 'sara@example.com', status: 'Pending', age: 31 },
    { id: 5, name: 'Alex Turner', email: 'alex@example.com', status: 'Active', age: 25 },
];

// Basic Table
export const Basic: Story = {
    args: {
        data: sampleData,
    },
};

// Table with row click handler
export const WithRowClick: Story = {
    args: {
        data: sampleData,
        onRowClick: record => console.log('Row clicked:', record),
    },
};

// Empty Table
export const Empty: Story = {
    args: {
        data: [],
    },
};

// Table with reference values
export const WithReferences: Story = {
    args: {
        table: 'orders',
        data: [
            { id: 'order::1001', customer: 'customers::1', product: 'products::5', amount: '$29.99', date: '2023-04-15' },
            { id: 'order::1002', customer: 'customers::2', product: 'products::3', amount: '$49.99', date: '2023-04-17' },
            { id: 'order::1003', customer: 'customers::1', product: 'products::7', amount: '$19.99', date: '2023-04-18' },
        ],
    },
};
