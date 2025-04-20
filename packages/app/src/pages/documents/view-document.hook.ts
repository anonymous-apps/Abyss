import { useNavigate, useParams } from 'react-router-dom';
import { useTableRecordDocument } from '../../state/database-connection';

export function useViewDocument() {
    const { id } = useParams();
    const navigate = useNavigate();

    const document = useTableRecordDocument(id || '');

    const breadcrumbs = [
        { name: 'Home', onClick: () => navigate('/') },
        { name: 'Documents', onClick: () => navigate('/documents') },
        { name: document.data?.title || id || '', onClick: () => navigate(`/documents/id/${id}`) },
    ];

    return {
        document,
        breadcrumbs,
        navigate,
    };
}
