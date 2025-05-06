import { GraphPortDefinition } from '@abyss/intelligence/dist/state-machine/type-definition.type';
import { ChevronDown } from 'lucide-react';
import React from 'react';
import { useScanTableModelConnections } from '../../../state/database-access-utils';
export interface SelectForAgentGraphProps {
    color: string;
    port: GraphPortDefinition;
    onSelect: (value: string) => void;
    value: string;
}

export function SelectForAgentGraph(props: SelectForAgentGraphProps) {
    if (props.port.dataType === 'chat-model') {
        const models = useScanTableModelConnections();
        if (!props.value && models.data && models.data.length) {
            props.onSelect(models.data[0].id);
        }
        return (
            <>
                <ChevronDown className="w-3 h-3 translate-x-5 translate-y-[1px]" />
                <select
                    value={props.value}
                    onChange={e => props.onSelect(e.target.value)}
                    className="w-[40%] pt-1 px-1 text-xs rounded-sm text-right"
                    style={{ backgroundColor: props.color + '10' }}
                >
                    {(models.data || []).map(model => (
                        <option key={model.id} className="text-sm" value={model.id}>
                            {model.name}
                        </option>
                    ))}
                </select>
            </>
        );
    }

    if (props.port.dataType === 'string') {
        return (
            <input
                value={props.value}
                onChange={e => props.onSelect(e.target.value)}
                className="w-[40%] pt-1 px-1 text-xs rounded-sm text-right"
                style={{ backgroundColor: props.color + '10' }}
            />
        );
    }

    return null;
}
