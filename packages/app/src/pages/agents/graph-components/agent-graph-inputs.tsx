import { GraphPortDefinition } from '@abyss/intelligence/dist/state-machine/type-definition.type';
import React from 'react';
import { ChatModelSelector } from './custom-selectors/ChatModelSelector';
import { StringInput } from './custom-selectors/StringInput';
import { ToolSetSelector } from './custom-selectors/ToolSetSelector';

export interface SelectForAgentGraphProps {
    color: string;
    port: GraphPortDefinition;
    onSelect: (value: any) => void;
    value: any;
}

export function SelectForAgentGraph(props: SelectForAgentGraphProps) {
    if (props.port.dataType === 'chat-model') {
        return <ChatModelSelector {...props} />;
    }

    if (props.port.dataType === 'string') {
        return <StringInput {...props} />;
    }

    if (props.port.dataType === 'tool-set') {
        return <ToolSetSelector {...props} />;
    }

    return null;
}
