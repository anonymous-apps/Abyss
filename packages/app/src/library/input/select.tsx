import React from 'react';

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    className?: string;
    label?: string;
}

export function Select({ value, onChange, options, placeholder, className = '', label }: SelectProps) {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-sm text-text-300">{label}</label>}
            <div className="relative w-[300px] ">
                <select
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className={`w-full bg-background-dark text-text-200 border border-background-light rounded px-2 py-1 text-sm focus:outline-none focus:border-primary-700 appearance-none pr-8 ${className}`}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-text-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
