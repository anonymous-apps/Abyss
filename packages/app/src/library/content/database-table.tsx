import React from 'react';
import { Link, useNavigate } from 'react-router';

interface DatabaseTableProps {
    table: string;
    records: Record<string, any>[];
}

export function TableKeyValue({ table, column, value }: { table: string; column: string; value: string }) {
    if (column === 'threadId') {
        return (
            <Link to={`/database/id/messageThread/record/${value}`} className="text-text-base underline hover:text-primary-base">
                {value}
            </Link>
        );
    }

    if (column === 'id') {
        return (
            <Link to={`/database/id/${table}/record/${value}`} className="text-text-base underline hover:text-primary-base">
                {value}
            </Link>
        );
    }

    if (column === 'assistantId') {
        return (
            <Link to={`/database/id/modelConnections/record/${value}`} className="text-text-base underline hover:text-primary-base">
                {value}
            </Link>
        );
    }

    if (column === 'apiCallId') {
        return (
            <Link to={`/database/id/apiCall/record/${value}`} className="text-text-base underline hover:text-primary-base">
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
    const navigate = useNavigate();

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
                        {columns.map((column, colIndex) => (
                            <th key={column} className="p-1.5 text-left text-text-200 font-medium border-b border-background-light">
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {records.map((record, rowIndex) => (
                        <tr key={rowIndex} className="truncate">
                            {columns.map((column, colIndex) => (
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
