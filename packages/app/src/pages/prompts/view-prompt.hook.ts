import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Database } from '../../main';
import { useTableRecordPrompt } from '../../state/database-connection';

export function useViewPrompt() {
    const { id } = useParams();
    const navigate = useNavigate();

    const prompt = useTableRecordPrompt(id || '');
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [dimensions, setDimensions] = useState('{}');

    useEffect(() => {
        if (prompt.data) {
            setName(prompt.data.name);
            setText(prompt.data.text);
            setDimensions(JSON.stringify(prompt.data.dimensions || {}, null, 2));
        }
    }, [prompt.data]);

    const handleUpdatePrompt = async () => {
        if (!id || !prompt.data) return;

        let parsedDimensions = {};
        try {
            parsedDimensions = JSON.parse(dimensions);
        } catch (e) {
            console.error('Invalid JSON for dimensions', e);
            return;
        }

        await Database.table.prompt.update(id, {
            name,
            text,
            dimensions: parsedDimensions,
        });
    };

    const handleDelete = async () => {
        if (!id) return;
        await Database.table.prompt.delete(id);
        navigate('/prompts');
    };

    const breadcrumbs = [
        { name: 'Home', onClick: () => navigate('/') },
        { name: 'Prompts', onClick: () => navigate('/prompts') },
        { name: prompt.data?.name || id || '', onClick: () => navigate(`/prompts/id/${id}`) },
    ];

    return {
        prompt,
        name,
        setName,
        text,
        setText,
        dimensions,
        setDimensions,
        breadcrumbs,
        handleUpdatePrompt,
        handleDelete,
        navigate,
    };
}
