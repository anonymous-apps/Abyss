import React from 'react';

interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    description?: string;
    className?: string;
    id?: string;
    disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, description, className = '', id, disabled = false }) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <div className="flex items-center gap-4">
                <input
                    type="checkbox"
                    id={checkboxId}
                    checked={checked}
                    onChange={e => onChange(e.target.checked)}
                    disabled={disabled}
                    className="h-4 w-4 rounded focus:ring-primary-100 bg-background-transparent checked:bg-primary-300"
                />
                {label && (
                    <label htmlFor={checkboxId} className="font-medium cursor-pointer">
                        {label}
                    </label>
                )}
            </div>
            {description && <p className="text-sm text-text-700 ml-8 opacity-70">{description}</p>}
        </div>
    );
};
