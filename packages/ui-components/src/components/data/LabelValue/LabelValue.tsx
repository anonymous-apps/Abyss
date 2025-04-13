import React from 'react';

export interface LabelValueProps {
    /**
     * Data object containing key-value pairs to display
     * Values can be strings, numbers, objects, arrays, or React nodes
     */
    data: Record<string, any>;
    /**
     * Optional CSS class name
     */
    className?: string;
    /**
     * Optional array of keys to ignore/exclude
     */
    ignoreKeys?: string[];
}

export const LabelValue: React.FC<LabelValueProps> = ({ data, className = '', ignoreKeys = [] }) => {
    // Filter out ignored keys
    const entries = Object.entries(data).filter(([key]) => !ignoreKeys.includes(key));

    if (entries.length === 0) {
        return <div className="text-text-400 text-xs p-2">No data available</div>;
    }

    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            {entries.map(([key, value]) => (
                <div key={key} className="flex flex-col hover:bg-background-200 p-1 rounded-sm">
                    <div className="text-xs text-text-600 font-medium lowercase mb-1">{key}</div>
                    <div className="text-sm break-words whitespace-pre-wrap">
                        {React.isValidElement(value) ? value : typeof value === 'object' ? JSON.stringify(value) : value || '-'}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LabelValue;
