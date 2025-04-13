import { useNavigate } from 'react-router-dom';
import { useScanTableTool } from '../../state/database-connection';

/**
 * Hook for ToolsPage component
 */
export function useToolsPage() {
    const tools = useScanTableTool();
    const navigate = useNavigate();

    const navigateToCreate = () => navigate('/tools/create');

    return {
        tools,
        navigateToCreate,
        navigate,
    };
}
