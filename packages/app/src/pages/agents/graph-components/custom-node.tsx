import { Handle, Position, useReactFlow } from '@xyflow/react';
import { XIcon } from 'lucide-react';
import React from 'react';
import { RenderedGraphNode } from './graph.types';
import { IdsToIcons } from './ids-to-icons';

export function CustomAgentGraphNode({ data }: { data: RenderedGraphNode['data'] }) {
    let leftHandles: React.ReactNode[] = [];
    let rightHandles: React.ReactNode[] = [];
    const { deleteElements } = useReactFlow();

    const Icon = IdsToIcons[data.definition.icon];

    for (const input of Object.values(data.definition.inputPorts)) {
        leftHandles.push(
            <div className="flex flex-col gap-1 relative" key={input.id}>
                <div className="text-[8px] text-text-500 px-2 relative flex flex-row gap-1 justify-start">
                    {input.name} <pre className="opacity-70">({input.dataType})</pre>
                    <Handle type="target" position={Position.Left} id={data.definition.id + '-' + input.id} />
                </div>
                <div className="text-[6px] text-text-500 px-2">{input.description}</div>
            </div>
        );
    }

    for (const output of Object.values(data.definition.outputPorts)) {
        rightHandles.push(
            <div className="flex flex-col gap-1 relative" key={output.id}>
                <div className="text-[8px] text-text-500 px-2 flex flex-row gap-1 justify-end relative">
                    {output.name} <pre className="opacity-70">({output.dataType})</pre>
                    <Handle type="source" position={Position.Right} id={data.definition.id + '-' + output.id} />
                </div>
                <div className="text-[6px] text-text-500 px-2">{output.description}</div>
            </div>
        );
    }

    const handleDelete = () => {
        deleteElements({ nodes: [{ id: data.definition.id }] });
    };

    return (
        <div className="bg-background-200">
            <div
                className="border rounded-md"
                style={{
                    backgroundColor: data.definition.color + '10',
                    borderColor: data.definition.color,
                }}
            >
                <div className="flex flex-col border-b gap-1 p-1 min-w-[300px]" style={{ borderColor: data.definition.color }}>
                    <div className="text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" color={data.definition.color} />
                            <div className="">{data.definition.name}</div>
                        </div>
                        <button
                            onClick={handleDelete}
                            className="rounded-sm hover:bg-background-300 text-text-500 hover:text-text-100 hover:bg-background-400"
                        >
                            <XIcon className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="text-[8px] text-text-500 ml-6">{data.definition.description}</div>
                </div>
                <div className="flex flex-row gap-2 relative my-1 mt-2 w-full">
                    <div className="flex flex-col gap-2 flex-1">{leftHandles}</div>
                    <div className="flex flex-col gap-2 flex-1 text-right">{rightHandles}</div>
                </div>
            </div>
        </div>
    );
}
