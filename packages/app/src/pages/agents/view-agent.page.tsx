import { Button, Checkbox, IconSection, LabelValue, PageCrumbed, SelectDropdown } from '@abyss/ui-components';
import { Bot, Box, Play, Trash2 } from 'lucide-react';
import React from 'react';
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
                <LabelValue
                    data={{
                        name: agent.data?.name || '',
                        description: agent.data?.description || '',
                    }}
                />
            </IconSection>

            <IconSection title="Model Configuration" icon={Box}>
                <div className="flex flex-col gap-4 max-w-2xl">
                    <SelectDropdown
                        selectedId={selectedModelId}
                        onSelect={handleUpdateModelId}
                        options={
                            modelConnections.data?.map(model => ({
                                id: model.id,
                                label: model.name,
                            })) || []
                        }
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
                                <SelectDropdown
                                    selectedId={selectedTools[tool.id]?.permission || 'automatic'}
                                    onSelect={permission => handleChangeToolPermission(tool.id, permission)}
                                    options={[
                                        { id: 'automatic', label: 'Automatic' },
                                        { id: 'user-controlled', label: 'User Controlled' },
                                    ]}
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
