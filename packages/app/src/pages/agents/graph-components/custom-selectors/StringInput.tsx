import React from 'react';

export interface StringInputProps {
    color: string;
    onSelect: (value: string) => void;
    value: string;
}

export function StringInput(props: StringInputProps) {
    return (
        <input
            value={props.value}
            onChange={e => props.onSelect(e.target.value)}
            className="w-[40%] pt-1 px-1 text-xs rounded-sm text-right"
            style={{ backgroundColor: props.color + '10' }}
        />
    );
}
