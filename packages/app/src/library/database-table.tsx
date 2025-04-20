import React from 'react';
import { Link } from 'react-router';

interface DatabaseTableProps {
    table: string;
    records: Record<string, any>[];
}

export function TableKeyValue({ table, column, value }: { table: string; column: string; value: string }) {
    if (value && value.toString().split('::').length === 2) {
        const [tableName] = value.toString().split('::');
        return (
            <Link to={`/database/id/${tableName}/record/${value}`} className="text-text-300 underline hover:text-primary-300">
                {value}
            </Link>
        );
    }

    if (value && !value.toString().includes('Object')) {
        return value.toString();
    }

    if (React.isValidElement(value)) {
        return value;
    }

    if (typeof value === 'object') {
        try {
            return JSON.stringify(value);
        } catch (error) {
            return 'Error parsing object';
        }
    }

    return value ? value.toString() : '-';
}

export function CustomTable({ table, records }: DatabaseTableProps) {
    if (!records || records.length === 0) {
        return <div className="text-text-700">No records found</div>;
    }

    // Get column headers from first record
    const columns = Object.keys(records[0]);

    return (
        <div className="overflow-x-auto rounded-sm text-text-700">
            <table className="w-full border-collapse text-xs overflow-hidden rounded-sm border">
                <thead>
                    <tr className="capitalize bg-background-transparent">
                        {columns
                            .filter(column => column !== 'createdAt' && column !== 'updatedAt')
                            .map((column, colIndex) => (
                                <th key={column} className="p-1.5 text-left text-text-100 font-medium border-b border-background-100">
                                    {column}
                                </th>
                            ))}
                    </tr>
                </thead>
                <tbody>
                    {records.map((record, rowIndex) => (
                        <tr key={rowIndex} className="truncate">
                            {columns
                                .filter(column => column !== 'createdAt' && column !== 'updatedAt')
                                .map((column, colIndex) => (
                                    <td key={column} className="p-1.5 text-text-300 max-w-[100px] truncate">
                                        <TableKeyValue table={table} column={column} value={record[column]} />
                                    </td>
                                ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
