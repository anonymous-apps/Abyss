import React from 'react';

interface InputProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    type?: 'text' | 'password';
    options?: Array<{
        id: string;
        name: string;
    }>;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const Input = ({ value, onChange, label, placeholder, type = 'text', options, onKeyDown }: InputProps) => {
    return (
        <div className="flex flex-col gap-1 mb-1">
            {label && <label className="text-sm text-text-300">{label}</label>}
            <div className="w-[300px]">
                <input
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    onKeyDown={onKeyDown}
                    className="w-full bg-background-transparent text-text-200 border border-background-light rounded px-2 py-1 text-sm focus:outline-none focus:border-primary-700"
                />
                {options && (
                    <div className="flex gap-2 mt-2">
                        {options.map(option => (
                            <button
                                key={option.id}
                                onClick={() => onChange(option.id)}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                    value === option.id
                                        ? 'border border-background-light bg-background-transparent'
                                        : 'border border-background-light hover:bg-background-transparent'
                                }`}
                            >
                                {option.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export const InputArea = ({ value, onChange, label, placeholder, onKeyDown }: InputProps) => {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-sm text-text-300">{label}</label>}
            <div className="">
                <textarea
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    onKeyDown={onKeyDown}
                    rows={7}
                    className="w-full bg-background-transparent text-text-200 border border-background-light rounded px-2 py-1 text-sm focus:outline-none focus:border-primary-700"
                />
            </div>
        </div>
    );
};
