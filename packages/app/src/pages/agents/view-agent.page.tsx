import { Bot, Box, Play, Trash2 } from 'lucide-react';
import React from 'react';
import { DestructiveButton } from '../../library/input/button';
import { Checkbox } from '../../library/input/checkbox';
import { EditableLabelValue } from '../../library/input/label-value';
import { Select } from '../../library/input/select';
import { IconSection } from '../../library/layout/icon-section';
import { PageCrumbed } from '../../library/layout/page-crumbed';
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
        <PageCrumbed title={`Agent: ${agent.data?.name || 'Loading...'}`} breadcrumbs={breadcrumbs}>
            <IconSection title="Agent Information" icon={Bot}>
                <EditableLabelValue
                    data={{
                        name: agent.data?.name || 'Loading...',
                        description: agent.data?.description || 'Loading...',
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
                <DestructiveButton onClick={handleDelete}>Delete Agent</DestructiveButton>
            </IconSection>
        </PageCrumbed>
    );
}
