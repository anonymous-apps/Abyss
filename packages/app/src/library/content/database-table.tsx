import React from 'react';
import { Link } from 'react-router';

interface DatabaseTableProps {
    table: string;
    records: Record<string, any>[];
    onPurgeTable;
}

export function TableKeyValue({ table, column, value }: { table: string; column: string; value: string }) {
    if (value && value.toString().split('::').length === 2) {
        const [tableName] = value.toString().split('::');
        return (
            <Link to={`/database/id/${tableName}/record/${value}`} className="text-text-base underline hover:text-primary-base">
                {value}
            </Link>
        );
    }

    if (value && !value.toString().includes('Object')) {
        return value.toString();
    }

    if (typeof value === 'object') {
        return JSON.stringify(value);
    }

    return value ? value.toString() : '-';
}

export function DatabaseTable({ table, records }: DatabaseTableProps) {
    if (!records || records.length === 0) {
        return <div className="text-text-500">No records found</div>;
    }

    // Get column headers from first record
    const columns = Object.keys(records[0]);

    return (
        <div className="overflow-x-auto rounded-sm text-text-dark">
            <table className="w-full border-collapse text-xs overflow-hidden rounded-sm border">
                <thead>
                    <tr className="capitalize bg-background-transparent">
                        {columns
                            .filter(column => column !== 'createdAt' && column !== 'updatedAt')
                            .map((column, colIndex) => (
                                <th key={column} className="p-1.5 text-left text-text-200 font-medium border-b border-background-light">
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
