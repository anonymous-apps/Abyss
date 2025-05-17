import type { ModelConnectionType } from '@abyss/records';
import { useNavigate, useParams } from 'react-router-dom';
import { Database } from '../../main';
import { useDatabaseRecord } from '../../state/database-connection';

export function useModelProfileView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const modelProfile = useDatabaseRecord<ModelConnectionType>('modelConnection', id || '');

    const handleDelete = async () => {
        if (!id) return;
        await Database.tables.modelConnection.ref(id).delete();
        navigate('/models');
    };

    const handleUpdateData = (data: Record<string, any>) => {
        if (!id || !modelProfile) return;
        const newData = { ...modelProfile, ...data };
        Database.tables.modelConnection.ref(id).update(newData);
    };

    const handleUpdateConfig = (configData: Record<string, any>) => {
        if (!id || !modelProfile) return;
        const newData = { ...modelProfile, connectionData: configData };
        Database.tables.modelConnection.ref(id).update(newData);
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
