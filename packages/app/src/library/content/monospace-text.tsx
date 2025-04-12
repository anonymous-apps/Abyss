import React from 'react';

interface MonospaceTextProps {
    text: string;
    showLineNumbers?: boolean;
    className?: string;
}

export const MonospaceText: React.FC<MonospaceTextProps> = ({ text, showLineNumbers = true, className }) => {
    const lines = text.trim().split('\n');

    return (
        <div className={`font-mono whitespace-pre-wrap overflow-x-auto ${className || ''}`}>
            {lines.map((line, index) => (
                <div key={`line-${index}`} className="flex">
                    {showLineNumbers && (
                        <div className="text-gray-500 text-right pr-3 select-none min-w-[2rem] border-r border-gray-300 mr-3">
                            {index + 1}
                        </div>
                    )}
                    <div className="break-all flex-1">{line || ' '}</div>
                </div>
            ))}
        </div>
    );
};
