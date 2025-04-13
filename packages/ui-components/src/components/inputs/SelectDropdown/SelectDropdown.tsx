import { ChevronDown } from 'lucide-react';
import React, { useRef } from 'react';

export interface SelectOption {
    id: string;
    label: string;
}

export interface SelectDropdownProps {
    /**
     * Options to display in the dropdown
     */
    options: SelectOption[];
    /**
     * ID of the currently selected option
     */
    selectedId?: string;
    /**
     * Function called when an option is selected
     */
    onSelect: (id: string) => void;
    /**
     * Optional className to apply custom styles
     */
    className?: string;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({ options, selectedId, onSelect, className = '' }) => {
    const selectRef = useRef<HTMLSelectElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onSelect(event.target.value);
    };

    return (
        <div className={`relative inline-block w-full ${className}`}>
            <div className="relative">
                <select
                    ref={selectRef}
                    value={selectedId}
                    onChange={handleChange}
                    className="appearance-none w-full px-3 py-2 text-sm font-medium rounded-sm 
                    bg-background-100 hover:bg-background-200
                    border border-background-300 transition-colors pr-8"
                >
                    {!selectedId && <option value="">Select</option>}
                    {options.map(option => (
                        <option key={option.id} value={option.id}>
                            {option.label}
                        </option>
                    ))}
                    {options.length === 0 && <option disabled>No options available</option>}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center justify-center px-2 pointer-events-none">
                    <ChevronDown className="h-4 w-4" />
                </div>
            </div>
        </div>
    );
};

export default SelectDropdown;
