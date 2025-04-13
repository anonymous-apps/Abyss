/**
 * Props for the TableCell component
 */
export interface TableCellProps {
    /**
     * The cell value to display
     */
    value: any;
    /**
     * Table name (for reference links)
     */
    table?: string;
    /**
     * Column name (for reference links)
     */
    column?: string;
    /**
     * Optional click handler for records
     */
    onRecordClick?: (record: Record<string, any>) => void;
}

/**
 * Props for the Table component
 */
export interface TableProps {
    /**
     * Table name (for reference purposes)
     */
    table?: string;
    /**
     * Array of data records to display
     */
    data: Record<string, any>[];
    /**
     * Optional click handler for rows
     */
    onRowClick?: (record: Record<string, any>) => void;
    /**
     * Optional click handler for records
     */
    onRecordClick?: (record: Record<string, any>) => void;
    /**
     * Optional CSS class name
     */
    className?: string;
    /**
     * Optional array of columns to ignore
     */
    ignoreColumns?: string[];
}
