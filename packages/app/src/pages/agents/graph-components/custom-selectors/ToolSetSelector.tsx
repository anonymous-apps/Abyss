import { CheckIcon, SquareDashedIcon } from 'lucide-react';
import React from 'react';
import { useScanTableToolDefinitions } from '../../../../state/database-access-utils';

export interface ToolSetSelectorProps {
    color: string;
    onSelect: (value: any) => void;
    value: any;
}

export function ToolSetSelector(props: ToolSetSelectorProps) {
    const [selectedTools, setSelectedTools] = React.useState<string[]>(props.value ? props.value : []);
    const { data: tools } = useScanTableToolDefinitions();

    const handleToolToggle = (toolId: string) => {
        const newSelectedTools = selectedTools.includes(toolId) ? selectedTools.filter(id => id !== toolId) : [...selectedTools, toolId];

        setSelectedTools(newSelectedTools);
        props.onSelect(newSelectedTools);
    };

    React.useEffect(() => {
        if (props.value) {
            try {
                setSelectedTools(props.value);
            } catch (e) {
                setSelectedTools([]);
            }
        }
    }, [props.value]);

    return (
        <div className="w-full">
            <div className="flex flex-wrap flex-row gap-2 max-h-48 overflow-y-auto mb-2">
                {!tools || tools.length === 0 ? (
                    <div className="p-2 text-xs">No tools available</div>
                ) : (
                    tools.map(tool => {
                        const isSelected = selectedTools.includes(tool.id);
                        return (
                            <div
                                key={tool.id}
                                className={`flex gap-2 px-2 items-center justify-between w-fit p-1 cursor-pointer transition-colors duration-150  rounded-sm border ${
                                    isSelected
                                        ? 'bg-primary-100 border-primary-200 hover:bg-primary-200'
                                        : 'border-transparent hover:bg-background-200'
                                }`}
                                onClick={() => handleToolToggle(tool.id)}
                            >
                                <div className="flex items-center">
                                    {isSelected ? (
                                        <CheckIcon size={10} className="text-primary-500" />
                                    ) : (
                                        <SquareDashedIcon size={10} className="text-text-500" />
                                    )}
                                </div>
                                <div className="text-[8px] font-medium">{tool.name}</div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
