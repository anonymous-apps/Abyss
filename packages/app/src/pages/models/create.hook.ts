import { ModelConnectionAccessFormat } from '@abyss/records';
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
        Database.table.modelConnection.create({
            name: name,
            description: 'A model connection for ' + selectedProvider + ' ' + selectedModel,
            providerId: selectedProvider,
            modelId: selectedModel,
            accessFormat: selectedProvider as ModelConnectionAccessFormat,
            data: data,
        });
        navigate('/models');
    };

    const navigateToHome = () => {
        navigate('/');
    };

    const navigateToModels = () => {
        navigate('/models');
    };

    const navigateToCreate = () => {
        navigate('/models/create');
    };

    const breadcrumbs = [
        { name: 'Home', onClick: navigateToHome },
        { name: 'Models', onClick: navigateToModels },
        { name: 'Create', onClick: navigateToCreate },
    ];

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
        breadcrumbs,
        navigateToHome,
        navigateToModels,
        navigateToCreate,
    };
}
