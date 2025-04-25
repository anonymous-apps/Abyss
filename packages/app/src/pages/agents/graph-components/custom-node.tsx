import { Handle, Position } from '@xyflow/react';
import React, { useCallback } from 'react';
import { RenderedGraphNode } from './graph.types';

export function CustomAgentGraphNode({ data }: { data: RenderedGraphNode['data'] }) {
    const onChange = useCallback(evt => {
        console.log(evt.target.value);
    }, []);

    let leftHandles: React.ReactNode[] = [];
    let rightHandles: React.ReactNode[] = [];
    console.log(data);

    for (const input of Object.values(data.definition.inputPorts)) {
        leftHandles.push(<Handle key={input.id} type="source" position={Position.Left} id={input.id} />);
    }

    for (const output of Object.values(data.definition.outputPorts)) {
        rightHandles.push(<Handle key={output.id} type="source" position={Position.Right} id={output.id} />);
    }

    return (
        <div className="bg-background-200">
            <div
                className="border rounded-md p-2"
                style={{
                    backgroundColor: data.definition.color + '20',
                    borderColor: data.definition.color,
                }}
            >
                {leftHandles}
                <div className="text-sm font-bold">
                    {data.definition.name}
                    <div className="text-xs text-background-500">{data.definition.description}</div>
                </div>
                {rightHandles}
            </div>
        </div>
    );
}
