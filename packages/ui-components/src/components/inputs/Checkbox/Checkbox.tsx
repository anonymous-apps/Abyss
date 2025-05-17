import type React from 'react';
import { type InputHTMLAttributes, useState } from 'react';

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
                        onChange={onChange}
                        disabled={isDisabled}
                        className={`
                                w-4 h-4 rounded appearance-none border border-background-300
                                ${checked ? 'bg-primary-500 border-primary-500' : 'bg-background-100'}
                                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                relative
                            `}
                        style={{
                            backgroundImage: checked
                                ? "url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e\")"
                                : '',
                            backgroundSize: '100% 100%',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
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
                {description && <p className="text-sm text-text-500 ml-8 opacity-70">{description}</p>}
            </div>
            {tooltip && showTooltip && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-primary-300 text-text-900 text-xs rounded shadow-lg whitespace-nowrap z-10">
                    {tooltip}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-primary-300" />
                </div>
            )}
        </div>
    );
};

export default Checkbox;
