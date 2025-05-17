import type { ReferencedToolDefinitionRecord } from '@abyss/records';
import { NodeHandler } from '../node-handler';
import type { NodeExecutionResult, ResolveNodeData } from '../type-base.type';
import type { GraphNodeDefinition } from '../type-definition.type';

export class InputToolsSelectionNode extends NodeHandler {
    constructor() {
        super('input-tools', 'static');
    }
    protected _getDefinition(): Omit<GraphNodeDefinition, 'id' | 'type'> {
        return {
            name: 'Tools Selection',
            icon: 'tool',
            description: 'Select specific tools from those in your system',
            color: '#515151',
            inputPorts: {},
            parameters: {},
            outputPorts: {
                toolSet: {
                    id: 'toolSet',
                    type: 'data',
                    dataType: 'tool-set',
                    name: 'Tools',
                    description: 'Selected tools as a tool set',
                    userConfigurable: true,
                },
            },
        };
    }

    protected async _resolve(data: ResolveNodeData): Promise<NodeExecutionResult> {
        console.log(data.parameters);
        const toolSet: string[] = data.parameters.toolSet || [];
        const toolReferences: ReferencedToolDefinitionRecord[] = toolSet.map(toolId => data.database.tables.toolDefinition.ref(toolId));

        return {
            portData: [
                {
                    portId: 'toolSet',
                    dataType: 'tool-set',
                    inputValue: toolReferences,
                },
            ],
        };
    }
}
