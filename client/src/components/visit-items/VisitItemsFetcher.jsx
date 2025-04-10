import { useEffect, useState, useCallback } from 'react';
import VisitItems from './VisitItems';
import request from '../../utils/request';

export default function VisitItemsFetcher({ tripId, email, userId, onLike, onEdit, onAddComment, reloadTrigger }) {
    const [visitItems, setVisitItems] = useState([]);

    const fetchVisitItems = useCallback(async () => {
        try {
            const response = await request.get('http://localhost:3030/jsonstore/visitItems');
            if (response) {
                const items = Object.values(response).filter(item => item.tripId === tripId);
                setVisitItems(items);
            } else {
                setVisitItems([]);
            }
        } catch (error) {
            console.error('Error fetching visit items:', error);
        }
    }, [tripId]);

    useEffect(() => {
        fetchVisitItems();
    }, [fetchVisitItems, reloadTrigger]); 

    return (
        <VisitItems
            visitItems={visitItems}
            email={email}
            userId={userId}
            onLike={onLike}
            onEdit={onEdit}
            onAddComment={onAddComment}
        />
    );
}
