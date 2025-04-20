import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database } from '../../main';

export function useCreatePrompt() {
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [dimensions, setDimensions] = useState('{}');

    const navigate = useNavigate();

    const handleCreatePrompt = async () => {
        let parsedDimensions = {};
        try {
            parsedDimensions = JSON.parse(dimensions);
        } catch (e) {
            console.error('Invalid JSON for dimensions', e);
            return;
        }

        await Database.table.prompt.create({
            name,
            text,
            dimensions: parsedDimensions,
        });

        navigate('/prompts');
    };

    const isFormValid = name && text;

    return {
        name,
        setName,
        text,
        setText,
        dimensions,
        setDimensions,
        handleCreatePrompt,
        isFormValid,
        navigate,
    };
}
