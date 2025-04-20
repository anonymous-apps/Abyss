import { useNavigate } from 'react-router-dom';
import { useScanTablePrompt } from '../../state/database-connection';

export function usePromptsPage() {
    const prompts = useScanTablePrompt();
    const navigate = useNavigate();

    const handleCreatePrompt = () => {
        navigate('/prompts/create');
    };

    return {
        prompts,
        handleCreatePrompt,
        navigate,
    };
}
