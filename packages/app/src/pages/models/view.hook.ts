import { useNavigate, useParams } from 'react-router-dom';
import { Database } from '../../main';
import { useTableRecordModelConnections } from '../../state/database-connection';

export function useModelProfileView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const modelProfile = useTableRecordModelConnections(id || '');

    const handleDelete = async () => {
        if (!id) return;
        await Database.table.modelConnections.delete(id);
        navigate('/models');
    };

    const handleUpdateData = (data: Record<string, any>) => {
        if (!id || !modelProfile.data) return;
        const newData = { ...modelProfile.data, ...data };
        Database.table.modelConnections.update(id, newData);
    };

    const handleUpdateConfig = (configData: Record<string, any>) => {
        if (!id || !modelProfile.data) return;
        const newData = { ...modelProfile.data, data: configData };
        Database.table.modelConnections.update(id, newData);
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
