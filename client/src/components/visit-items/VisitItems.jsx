import { useEffect, useState } from 'react';
import request from '../../utils/request';
import './VisitItems.css';

export default function VisitItems({ visitItems }) {
    const [likes, setLikes] = useState([]);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const fetchedLikes = await request.get('http://localhost:3030/jsonstore/likes');
                setLikes(fetchedLikes);  // Store likes data
            } catch (error) {
                console.error('Error fetching likes:', error);
            }
        };

        fetchLikes();
    }, []);  // Empty array means this runs once on mount

    const getLikeCount = (itemId) => {
        // Filter likes to count how many likes this particular visit item has
        return Object.values(likes).filter(like => like.visitItemId === itemId).length;
    };

    return (
        <div id="visit-items">
            <h2>Visit Items</h2>
            {Object.values(visitItems)?.length > 0 ? (
                Object.values(visitItems).map((item) => {
                    // Ensure 'item' is valid before trying to access its properties
                    if (!item) return null;

                    return (
                        <div key={item._id} className="visit-item-card">
                            <img src={item.imageUrl} alt={item.title} />
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            <span>Likes: {getLikeCount(item._id)}</span>
                            {/* Comments */}
                            <div>
                                {item.comments?.map((comment, index) => (
                                    <div key={index}>
                                        <p>{comment.content}</p>
                                        <small>by {comment.userId}</small>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })
            ) : (
                <p>No visit items for this trip yet.</p>
            )}
        </div>
    );
}
