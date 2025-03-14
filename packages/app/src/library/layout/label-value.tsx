import React from 'react';

interface LabelValueProps {
    data: Record<string, any>;
    className?: string;
}

export const LabelValue: React.FC<LabelValueProps> = ({ data, className = '' }) => {
    return (
        <div className={`grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-xs items-center ${className} w-full max-w-full overflow-hidden`}>
            {Object.entries(data).map(([key, value]) => (
                <React.Fragment key={key}>
                    <div className="rounded-sm font-sm text-text-400 min-w-[100px] max-w-[200px] bg-background-transparent capitalize h-full p-1 border-r border-background-light border-b text-center break-words overflow-hidden text-ellipsis">
                        {key}
                    </div>
                    <div className="text-text-300 capitalize break-words whitespace-pre-wrap w-full overflow-hidden">
                        {React.isValidElement(value) ? value : typeof value === 'object' ? JSON.stringify(value) : value}
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
};
