import React, { useEffect } from 'react';

interface EditableLabelValueProps {
    data: Record<string, any>;
    editableKeys?: string[];
    onChange?: (updatedData: Record<string, any>) => void;
    className?: string;
}
export const EditableLabelValue: React.FC<EditableLabelValueProps> = ({ data, editableKeys = [], onChange, className = '' }) => {
    const [localData, setLocalData] = React.useState<Record<string, any>>(data);

    useEffect(() => {
        setLocalData(data);
    }, [data]);

    const handleLocalChange = (key: string, value: any) => {
        setLocalData(prev => ({ ...prev, [key]: value }));
    };

    const handleBlur = (key: string) => {
        if (onChange && localData[key] !== data[key]) {
            const updatedData = { ...data, [key]: localData[key] };
            onChange(updatedData);
        }
    };

    return (
        <div className={`grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-xs items-center ${className} w-full max-w-full overflow-hidden`}>
            {Object.entries(data).map(([key, value]) => (
                <React.Fragment key={key}>
                    <div className="rounded-sm font-sm text-text-400 min-w-[100px] max-w-[200px] bg-background-transparent capitalize h-full p-1 border-r border-background-light border-b text-center break-words overflow-hidden text-ellipsis">
                        {key}
                    </div>
                    {editableKeys.includes(key) ? (
                        <input
                            type="text"
                            value={typeof localData[key] === 'object' ? JSON.stringify(localData[key]) : String(localData[key])}
                            onChange={e => handleLocalChange(key, e.target.value)}
                            onBlur={() => handleBlur(key)}
                            className="bg-background-transparent border border-background-light rounded px-2 py-1 w-full"
                        />
                    ) : (
                        <div className="capitalize break-words whitespace-pre-wrap w-full overflow-hidden">
                            {React.isValidElement(value) ? value : typeof value === 'object' ? JSON.stringify(value) : value}
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};
