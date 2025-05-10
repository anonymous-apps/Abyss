import { CheckIcon, XIcon } from 'lucide-react';
import React from 'react';
import { useScanTableToolDefinitions } from '../../../../state/database-access-utils';

export interface ToolSetSelectorProps {
    color: string;
    onSelect: (value: any) => void;
    value: any;
}

export function ToolSetSelector(props: ToolSetSelectorProps) {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedTools, setSelectedTools] = React.useState<string[]>(props.value ? props.value : []);
    const { data: tools } = useScanTableToolDefinitions();

    const filteredTools = React.useMemo(() => {
        return (tools || []).filter(
            tool =>
                tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tool.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [tools, searchTerm]);

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
            <div className="mb-1">
                <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full px-2 py-1 text-xs rounded border-transparent border focus:border-primary-300"
                    style={{ backgroundColor: props.color + '10' }}
                />
            </div>

            <div className="max-h-48 overflow-y-auto rounded mb-2 bg-background-transparent">
                {filteredTools.length === 0 ? (
                    <div className="p-2 text-xs text-text-500">No tools found</div>
                ) : (
                    filteredTools.map(tool => {
                        const isSelected = selectedTools.includes(tool.id);
                        return (
                            <div
                                key={tool.id}
                                className="flex items-center justify-between p-2 cursor-pointer"
                                onClick={() => handleToolToggle(tool.id)}
                                style={{ fontSize: 10 }}
                            >
                                <div className="">{tool.name}</div>
                                <div className="flex items-center">
                                    {isSelected ? (
                                        <CheckIcon size={12} className="text-primary-500 bg-primary-100 rounded" />
                                    ) : (
                                        <XIcon size={12} className="text-primary-500 rounded" />
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="text-xs text-right" style={{ fontSize: 10, padding: '2px 4px', borderRadius: '2px' }}>
                {selectedTools.length} tool{selectedTools.length !== 1 ? 's' : ''} selected
            </div>
        </div>
    );
}
