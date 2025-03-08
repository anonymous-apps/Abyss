import React, { useState } from 'react';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { Button } from '../../library/input/button';
import { Box, Globe, Settings } from 'lucide-react';
import { IconSection } from '../../library/layout/icon-section';
import { Database } from '../../main';
import { useNavigate } from 'react-router';
import { Input } from '../../library/input/input';
import { Select } from '../../library/input/select';

const ActionTypes = [
    {
        name: 'NodeJS Script',
        value: 'nodejs script',
    },
];

export function ActionCreatePage() {
    const [name, setName] = useState<string>('');
    const [type, setType] = useState<string>('');
    const [metadata, setMetadata] = useState<any>({});

    const navigate = useNavigate();

    const handleCreateAction = () => {
        Database.table.actionDefinitions.create({
            name: name,
            type: type,
            data: metadata,
        });
        navigate('/actions');
    };

    return (
        <PageCrumbed
            title="Create Action"
            breadcrumbs={[
                { name: 'Home', url: '/' },
                { name: 'Actions', url: '/actions' },
                { name: 'Create', url: '/actions/create' },
            ]}
        >
            <IconSection title="Name" subtitle="The name for your action" icon={Box}>
                <Input label="Name" value={name} onChange={setName} />
                <Select
                    value={type}
                    label="Action Type"
                    onChange={setType}
                    options={ActionTypes.map(t => ({ value: t.value, label: t.name }))}
                    placeholder="Select action type"
                />
            </IconSection>

            <IconSection
                title="Action Configuration"
                subtitle={
                    type
                        ? `Configure the ${type} action. Configuration data is stored locally on your machine.`
                        : 'Select a type to continue'
                }
                icon={Settings}
            >
                <div className={type ? 'flex flex-col gap-4' : 'hidden'}>
                    {type && (
                        <Input
                            label="Script Path"
                            value={metadata.scriptPath || ''}
                            onChange={value => setMetadata({ ...metadata, scriptPath: value })}
                        />
                    )}
                    <Button className="max-w-[300px]" onClick={handleCreateAction}>
                        Create Action
                    </Button>
                </div>
            </IconSection>
        </PageCrumbed>
    );
}
