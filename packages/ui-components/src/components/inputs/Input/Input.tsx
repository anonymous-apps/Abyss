import type { LucideIcon } from 'lucide-react';
import type React from 'react';
import { type InputHTMLAttributes, useState } from 'react';

export interface InputOption {
    /**
     * Display text for the option pill
     */
    label: string;
    /**
     * Content to fill the input with when option is clicked
     */
    content: string;
}

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    /**
     * Optional Lucide icon to display inside the input
     */
    icon?: LucideIcon;
    /**
     * Is the input disabled
     */
    isDisabled?: boolean;
    /**
     * Optional label to display above the input
     */
    label?: string;
    /**
     * Optional array of options to display as pills below the input
     */
    options?: InputOption[];
    /**
     * onChange handler that returns the string value directly
     */
    onChange?: (value: string) => void;
}

export const Input: React.FC<InputProps> = ({
    icon: Icon,
    isDisabled = false,
    className = '',
    placeholder,
    label,
    options = [],
    onChange,
    ...props
}) => {
    const inputId = props.id || `input-${Math.random().toString(36).substring(2, 9)}`;
    const [value, setValue] = useState(props.value || '');

    // Base styles
    const baseStyles =
        'w-full bg-background-transparent text-text-100 border rounded px-3 py-2 text-sm focus:outline-none transition-colors';
    const iconStyles = Icon ? 'pl-10' : '';
    const disabledStyles = isDisabled ? 'opacity-60 cursor-not-allowed' : '';
    const providedStyles = className;

    const handleOptionClick = (content: string) => {
        if (isDisabled) return;

        setValue(content);

        // Call onChange with the string value directly
        if (onChange) {
            onChange(content);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);

        // Call onChange with the string value directly
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <div className="relative">
            {Icon && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-400">
                    <Icon className="h-4 w-4" />
                </div>
            )}
            {label && <div className="text-text-500 text-sm mb-1">{label}</div>}
            <input
                id={inputId}
                disabled={isDisabled}
                placeholder={placeholder}
                className={`${baseStyles} border-background-100 focus:border-primary-700 ${iconStyles} ${disabledStyles} ${providedStyles}`}
                value={value}
                onChange={handleInputChange}
                {...props}
            />

            {options.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleOptionClick(option.content)}
                            disabled={isDisabled}
                            className="inline-flex items-center pr-2.5 py-1 rounded-full text-xs font-medium bg-background-50 text-text-600 hover:bg-primary-50 hover:text-primary-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Input;
