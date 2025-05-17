import { SquareArrowOutUpRight } from 'lucide-react';
import React from 'react';
import type { TableCellProps, TableProps } from './TableTypes';

export const TableCell: React.FC<TableCellProps> = ({ value, onRecordClick }) => {
    if (value === null || value === undefined) {
        return <>-</>;
    }

    if (React.isValidElement(value)) {
        return <>{value}</>;
    }

    if (typeof value === 'object') {
        try {
            return <>{JSON.stringify(value)}</>;
        } catch (_error) {
            return <>Error parsing object</>;
        }
    }

    // Check if value is a reference (format: tableName::id)
    if (value && value.toString().split('::').length === 2) {
        const [recordTable, recordId] = value.toString().split('::');
        const [recordSegment] = recordId.split('-');
        return (
            <button
                type="button"
                className="text-text-300 flex items-center gap-1 hover:underline hover:text-primary-500 cursor-pointer capitalize"
                onClick={e => {
                    e.stopPropagation();
                    onRecordClick?.(value.toString());
                }}
                onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation();
                        onRecordClick?.(value.toString());
                    }
                }}
            >
                <SquareArrowOutUpRight className="w-3 h-3 inline-block" />
                {recordTable} {recordSegment}
            </button>
        );
    }

    return <>{value.toString()}</>;
};

export const Table: React.FC<TableProps> = ({ data, onRowClick, className = '', ignoreColumns = [], onRecordClick }) => {
    if (!data || data.length === 0) {
        return <div className="text-text-700 p-4 text-center">No data available</div>;
    }

    // Get columns from the first record
    const columns = Object.keys(data[0]).filter(column => !ignoreColumns.includes(column));

    const handleRowClick = (record: Record<string, unknown>) => {
        if (onRowClick) {
            onRowClick(record);
        }
    };

    return (
        <div className={`w-full rounded-sm ${className} p-2 bg-background-100`}>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs overflow-hidden rounded-sm border">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-background-300">
                            {columns.map(column => (
                                <th
                                    key={column}
                                    className="p-2 text-text-100 font-medium border-b border-background-100 capitalize"
                                    style={{ textAlign: 'left' }}
                                >
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((record, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={`${onRowClick ? 'hover:bg-primary-100 transition-colors cursor-pointer' : ''}`}
                                onClick={() => handleRowClick(record)}
                            >
                                {columns.map((column, indexCol) => (
                                    <td
                                        key={indexCol}
                                        className="p-2 text-text-300 max-w-[250px] truncate border-b border-background-100 border-opacity-50"
                                    >
                                        <TableCell value={record[column]} onRecordClick={onRecordClick} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
