import { useNavigate, useParams } from 'react-router-dom';
import { Database } from '../../main';
import { useTableRecordTool } from '../../state/database-connection';

/**
 * Hook for ToolViewPage component
 */
export function useToolViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const tool = useTableRecordTool(id || '');

    const handleDelete = async () => {
        if (!id) return;
        await Database.table.tool.delete(id);
        navigate('/tools');
    };

    const handleChange = (data: any) => {
        if (!id) return;
        const newData = { ...tool.data, ...data };
        if (data.schema && typeof data.schema === 'string') {
            newData.schema = JSON.parse(data.schema);
        }
        Database.table.tool.update(id, newData);
    };

    const breadcrumbs = [
        { name: 'Home', onClick: () => navigate('/') },
        { name: 'Tools', onClick: () => navigate('/tools') },
        { name: id || '', onClick: () => navigate(`/tools/id/${id}`) },
    ];

    return {
        id,
        tool,
        handleDelete,
        handleChange,
        breadcrumbs,
    };
}
