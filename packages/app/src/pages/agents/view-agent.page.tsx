import { Button, Checkbox, IconSection, PageCrumbed } from '@abyss/ui-components';
import { Bot, Box, Play, Trash2 } from 'lucide-react';
import React from 'react';
import { EditableLabelValue } from '../../library/input/label-value';
import { Select } from '../../library/input/select';
import { useViewAgent } from './view-agent.hook';

export function ViewAgentPage() {
    const {
        agent,
        selectedModelId,
        selectedTools,
        modelConnections,
        tools,
        toolConnections,
        breadcrumbs,
        handleUpdateAgent,
        handleUpdateModelId,
        handleToggleTool,
        handleChangeToolPermission,
        handleDelete,
    } = useViewAgent();

    return (
        <PageCrumbed title={`Agent: ${agent.data?.name || ''}`} breadcrumbs={breadcrumbs}>
            <IconSection title="Agent Information" icon={Bot}>
                <EditableLabelValue
                    data={{
                        name: agent.data?.name || '',
                        description: agent.data?.description || '',
                    }}
                    editableKeys={['name', 'description']}
                    onChange={handleUpdateAgent}
                />
            </IconSection>

            <IconSection title="Model Configuration" icon={Box}>
                <div className="flex flex-col gap-4 max-w-2xl">
                    <Select
                        label="Choose a model"
                        value={selectedModelId}
                        onChange={handleUpdateModelId}
                        options={
                            modelConnections.data?.map(model => ({
                                value: model.id,
                                label: model.name,
                            })) || []
                        }
                        placeholder="Select a model"
                    />
                </div>
            </IconSection>

            <IconSection title="Tool Configuration" icon={Play}>
                {!tools.loading && toolConnections ? (
                    <div className="grid grid-cols-1 gap-4">
                        {tools.data?.map(tool => (
                            <div key={tool.id} className="flex flex-row gap-2 p-4 rounded-md justify-between w-full">
                                <Checkbox
                                    id={`tool-${tool.id}`}
                                    checked={selectedTools[tool.id]?.selected || false}
                                    onChange={() => handleToggleTool(tool.id)}
                                    label={tool.name}
                                    description={tool.description}
                                />
                                <Select
                                    value={selectedTools[tool.id]?.permission || 'automatic'}
                                    onChange={permission => handleChangeToolPermission(tool.id, permission)}
                                    options={[
                                        { value: 'automatic', label: 'Automatic' },
                                        { value: 'user-controlled', label: 'User Controlled' },
                                    ]}
                                    disabled={!selectedTools[tool.id]?.selected}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>Loading tool configuration...</div>
                )}
            </IconSection>

            <IconSection title="Danger Zone" icon={Trash2}>
                <Button icon={Trash2} onClick={handleDelete}>
                    Delete Agent
                </Button>
            </IconSection>
        </PageCrumbed>
    );
}
