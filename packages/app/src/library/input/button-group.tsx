import React from 'react';

export interface ButtonGroupOption<T extends string> {
    label: any;
    value: T;
}

interface ButtonGroupProps<T extends string> {
    options: ButtonGroupOption<T>[];
    value: T;
    onChange: (value: T) => void;
    className?: string;
    disabled?: boolean;
}

export function ButtonGroup<T extends string>({ options, value, onChange, className = '', disabled = false }: ButtonGroupProps<T>) {
    return (
        <div className={`flex rounded overflow-hidden border border-background-dark ${className}`}>
            {options.map((option, index) => {
                const isFirst = index === 0;
                const isLast = index === options.length - 1;
                const isSelected = option.value === value;

                return (
                    <button
                        key={option.value}
                        onClick={() => !disabled && onChange(option.value)}
                        disabled={disabled}
                        className={`
                            px-2 py-1 text-xs font-medium transition-colors
                            ${isFirst ? 'rounded-l-sm' : ''}
                            ${isLast ? 'rounded-r-sm' : ''}
                            ${
                                isSelected
                                    ? 'bg-primary-base text-text-light'
                                    : 'bg-background-transparent text-text-base hover:bg-primary-light hover:text-text-light'
                            }
                            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                            ${!isLast ? 'border-r border-background-dark' : ''}
                        `}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
