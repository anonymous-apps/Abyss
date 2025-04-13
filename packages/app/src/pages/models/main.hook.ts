import { useNavigate } from 'react-router-dom';
import { useScanTableModelConnections } from '../../state/database-connection';

export function useModelProfileMain() {
    const modelProfiles = useScanTableModelConnections();
    const navigate = useNavigate();

    const handleCreateNew = () => {
        navigate('/models/create');
    };

    return {
        modelProfiles,
        handleCreateNew,
        navigate,
    };
}
