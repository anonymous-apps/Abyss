import React, { InputHTMLAttributes, useState } from 'react';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    /**
     * Is the checkbox checked
     */
    checked: boolean;
    /**
     * Optional label text
     */
    label?: string;
    /**
     * Optional description text
     */
    description?: string;
    /**
     * Is the checkbox disabled
     */
    isDisabled?: boolean;
    /**
     * Optional tooltip text to display on hover
     */
    tooltip?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
    checked,
    label,
    description,
    isDisabled = false,
    tooltip,
    className = '',
    onChange,
    ...props
}) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const checkboxId = props.id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => tooltip && setShowTooltip(true)}
            onMouseLeave={() => tooltip && setShowTooltip(false)}
        >
            <div className={`flex flex-col gap-1 ${className}`}>
                <div className="flex items-center gap-4">
                    <input
                        type="checkbox"
                        id={checkboxId}
                        checked={checked}
                        onChange={e => {
                            if (onChange) {
                                onChange(e);
                            }
                        }}
                        disabled={isDisabled}
                        className={`
                            h-4 w-4 rounded 
                            focus:ring-2 focus:ring-primary-500 
                            bg-background-transparent 
                            checked:bg-primary-500 
                            border border-background-300
                            ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                        {...props}
                    />
                    {label && (
                        <label
                            htmlFor={checkboxId}
                            className={`font-medium ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            {label}
                        </label>
                    )}
                </div>
                {description && <p className="text-sm text-text-700 ml-8 opacity-70">{description}</p>}
            </div>
            {tooltip && showTooltip && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-primary-300 text-text-900 text-xs rounded shadow-lg whitespace-nowrap z-10">
                    {tooltip}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-primary-300"></div>
                </div>
            )}
        </div>
    );
};

export default Checkbox;
