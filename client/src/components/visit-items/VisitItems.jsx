import { useEffect, useState } from 'react';
import request from '../../utils/request';
import './VisitItems.css';
import itemLikesService from '../../services/itemLikesService';

export default function VisitItems({ visitItems, email, userId }) {
    const [likes, setLikes] = useState([]); // Holds the likes data
    const [isLiked, setIsLiked] = useState(false); // Tracks if an item is liked (global)
    const [visitItemId, setVisitItemId] = useState([]); // Stores the visit item IDs
    const [likedItems, setLikedItems] = useState({}); // Tracks if a specific item is liked

    useEffect(() => {
        const visitItemIds = Object.values(visitItems).map((item) => item._id);
        setVisitItemId(visitItemIds);

        const fetchLikes = async () => {
            try {
                const fetchedLikes = await request.get('http://localhost:3030/jsonstore/itemLikes');
                setLikes(fetchedLikes);  // Store likes data
            } catch (error) {
                console.error('Error fetching likes:', error);
            }
        };

        fetchLikes();
    }, [likedItems]);  // Empty array means this runs once on mount

    const getLikeCount = (itemId) => {
        // Filter likes to count how many likes this particular visit item has
        return Object.values(likes).filter(like => like.visitItemId === itemId).length;
    };

    const likeHandler = async (itemId) => {
        try {
            // Ensure itemId is valid before liking the item
            if (!itemId) {
                console.error('Invalid itemId for liking');
                return;
            }

            // Create the new like object
            const newLike = { email, visitItemId: itemId, like: true, userId };

            // Call the service to create the like
            await itemLikesService.createItemLike(email, itemId, true, userId);

            // Safely update the likes state
            setLikes((prevLikes) => {
                if (Array.isArray(prevLikes)) {
                    return [...prevLikes, newLike];  // Add the new like to the list of likes
                }
                return [newLike];  // In case prevLikes isn't an array, initialize it with the newLike
            });

            // Update the liked status for this specific item
            setLikedItems((prevLikedItems) => ({
                ...prevLikedItems,
                [itemId]: true,  // Mark the specific item as liked
            }));

            setIsLiked(true);
        } catch (error) {
            console.error('Error liking the item:', error);
        }
    };

    // Handle unlike
    const unlikeHandler = async (itemId) => {
        try {
            await itemLikesService.delete(email, itemId);
            
            // Safeguard: Ensure prevLikes is an array before calling .filter
            setLikes((prevLikes) => {
                // Make sure prevLikes is an array, or return an empty array if not
                const likesArray = Array.isArray(prevLikes) ? prevLikes : [];
                return likesArray.filter(like => like.email !== email && like.visitItemId !== itemId);
            });
    
            setLikedItems((prevLikedItems) => ({
                ...prevLikedItems,
                [itemId]: false,  // Mark the specific item as not liked
            }));
    
            setIsLiked(false);
        } catch (error) {
            console.error('Error unliking the item:', error);
        }
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
                            <div className="likes-section">
                                {likedItems[item._id] ? (
                                    <button onClick={() => unlikeHandler(item._id)} className="button">Unlike</button>
                                ) : (
                                    <button onClick={() => likeHandler(item._id)} className="button">Like</button>
                                )}
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
