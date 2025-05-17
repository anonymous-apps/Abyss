import type React from 'react';
import type { TextareaHTMLAttributes } from 'react';

export interface InputAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    /**
     * Is the textarea disabled
     */
    isDisabled?: boolean;
    /**
     * Number of rows to display
     */
    rows?: number;
}

export const InputArea: React.FC<InputAreaProps> = ({ isDisabled = false, className = '', placeholder, rows = 5, ...props }) => {
    const textareaId = props.id || `textarea-${Math.random().toString(36).substring(2, 9)}`;

    // Base styles
    const baseStyles =
        'w-full bg-background-transparent text-text-100 border rounded px-3 py-2 text-sm focus:outline-none transition-colors resize-vertical';
    const disabledStyles = isDisabled ? 'opacity-60 cursor-not-allowed' : '';
    const providedStyles = className;

    return (
        <div>
            <textarea
                id={textareaId}
                disabled={isDisabled}
                placeholder={placeholder}
                rows={rows}
                className={`${baseStyles} border-background-100 focus:border-primary-700 ${disabledStyles} ${providedStyles}`}
                {...props}
            />
        </div>
    );
};

export default InputArea;
