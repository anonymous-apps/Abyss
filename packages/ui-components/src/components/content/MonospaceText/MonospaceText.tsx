import type React from 'react';

export interface MonospaceTextProps {
    /**
     * Text content to display in monospace font
     */
    text: string;
    /**
     * Whether to show line numbers
     */
    showLineNumbers?: boolean;
    /**
     * Additional CSS class names
     */
    className?: string;
}

export const MonospaceText: React.FC<MonospaceTextProps> = ({ text, showLineNumbers = true, className }) => {
    const lines = (text + '').trim().split('\n');

    return (
        <div className={`text-xs font-mono whitespace-pre-wrap overflow-x-auto text-text-300 ${className || ''}`}>
            {lines.map((line, index) => (
                <div key={`line-${index}`} className="flex">
                    {showLineNumbers && (
                        <div className="text-text-600 text-right pr-3 select-none min-w-[2rem] border-r border-background-400 mr-3">
                            {index + 1}
                        </div>
                    )}
                    <div className="break-all flex-1">{line || ' '}</div>
                </div>
            ))}
        </div>
    );
};

export default MonospaceText;
