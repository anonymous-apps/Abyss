import { ModelConnectionRecord } from '@abyss/records';
import { useNavigate, useParams } from 'react-router-dom';
import { Database } from '../../main';
import { useDatabaseRecord } from '../../state/database-connection';

export function useModelProfileView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const modelProfile = useDatabaseRecord<ModelConnectionRecord>('modelConnection', id || '');

    const handleDelete = async () => {
        if (!id) return;
        await Database.table.modelConnection.delete(id);
        navigate('/models');
    };

    const handleUpdateData = (data: Record<string, any>) => {
        if (!id || !modelProfile) return;
        const newData = { ...modelProfile, ...data };
        Database.table.modelConnection.update(id, newData);
    };

    const handleUpdateConfig = (configData: Record<string, any>) => {
        if (!id || !modelProfile) return;
        const newData = { ...modelProfile, data: configData };
        Database.table.modelConnection.update(id, newData);
    };

    const breadcrumbs = [
        { name: 'Home', onClick: () => navigate('/') },
        { name: 'Models', onClick: () => navigate('/models') },
        { name: id || '', onClick: () => navigate(`/models/id/${id}`) },
    ];

    return {
        id,
        modelProfile,
        handleDelete,
        handleUpdateData,
        handleUpdateConfig,
        breadcrumbs,
    };
}
