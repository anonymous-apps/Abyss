import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Database } from '../../main';

export function useModelProfileCreate() {
    const [selectedProvider, setSelectedProvider] = useState<string>('');
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [data, setData] = useState<any>({});

    const navigate = useNavigate();

    const handleCreateConnection = () => {
        Database.table.modelConnections.create({
            name: name,
            description: 'A model connection for ' + selectedProvider + ' ' + selectedModel,
            provider: selectedProvider,
            modelId: selectedModel,
            data: data,
        });
        navigate('/models');
    };

    return {
        selectedProvider,
        setSelectedProvider,
        selectedModel,
        setSelectedModel,
        name,
        setName,
        data,
        setData,
        handleCreateConnection,
        navigate,
    };
}
