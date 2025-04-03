import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import request from '../../utils/request';
import './VisitItems.css';
import itemLikesService from '../../services/itemLikesService';
import { useDeleteItem } from '../../api/visitItemApi';

export default function VisitItems({ visitItems, email, userId, onEdit }) {
    const [likes, setLikes] = useState([]); // Holds the likes data
    const [isLiked, setIsLiked] = useState(false); // Tracks if an item is liked (global)
    const [visitItemId, setVisitItemId] = useState([]); // Stores the visit item IDs 
    const [likedItems, setLikedItems] = useState({}); // Tracks if a specific item is liked
    const navigate = useNavigate();
    const { deleteItem } = useDeleteItem();

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
    }, [likedItems, isLiked]);  // Empty array means this runs once on mount

    const getLikeCount = (visitItemId) => {
        // Filter likes to count how many likes this particular visit item has
        return Object.values(likes).filter(like => like.visitItemId === visitItemId).length;
    };

    const likeHandler = async (visitItemId) => {
        try {
            // Create the new like object
            const newLike = { email, visitItemId: visitItemId, like: true, userId };

            // Call the service to create the like
            await itemLikesService.createItemLike(email, visitItemId, true, userId);

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
                [visitItemId]: true,  // Mark the specific item as liked
            }));

            setIsLiked(true);
        } catch (error) {
            console.error('Error liking the item:', error);
        }
    };

    // Handle unlike
    const unlikeHandler = async (visitItemId) => {
        try {
            await itemLikesService.delete(email, visitItemId);

            // Safeguard: Ensure prevLikes is an array before calling .filter
            setLikes((prevLikes) => {
                // Make sure prevLikes is an array, or return an empty array if not
                const likesArray = Array.isArray(prevLikes) ? prevLikes : [];
                return likesArray.filter(like => like.email !== email && like.visitItemId !== visitItemId);
            });

            setLikedItems((prevLikedItems) => ({
                ...prevLikedItems,
                [visitItemId]: false,  // Mark the specific item as not liked
            }));

            setIsLiked(false);
        } catch (error) {
            console.error('Error unliking the item:', error);
        }
    };

    // Handle trip deletion
    const itemDeleteClickHandler = useCallback(async () => {
        const hasConfirm = confirm(`Are you sure you want to delete this place for visit?`);
        if (!hasConfirm) return;

        await deleteItem(visitItemId);
        navigate(0);
    }, [visitItemId, deleteItem, navigate]);

    return (
        <div id="visit-items">
            <h2>Visit Items</h2>
            {Object.values(visitItems)?.length > 0 ? (
                Object.values(visitItems).map((item) => {
                    // Ensure 'item' is valid before trying to access its properties
                    if (!item) return null;

                    const userLikeForItem = Object.values(likes).find(like =>
                        like.email === email && like.visitItemId === item._id
                    );

                    console.log(item?._ownerId);
                    console.log(userId);
                    const isOwner = userId === item?._ownerId;

                    return (
                        <div key={item._id} className="visit-item-card">
                            <img src={item.imageUrl} alt={item.title} />
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            <span>Likes: {getLikeCount(item._id)}</span>
                            <div className="likes-section">
                                {/* Only show Unlike button if the user has liked the item */}
                                {userLikeForItem ? (
                                    <button onClick={() => unlikeHandler(item._id)} className="button">Unlike</button>
                                ) : (
                                    <button onClick={() => likeHandler(item._id)} className="button">Like</button>
                                )}

                                {isOwner && (
                                    <div className="buttons">
                                        <button onClick={() => onEdit(item)} className="button">Edit</button>
                                        <button onClick={itemDeleteClickHandler} className="button">Delete</button>
                                    </div>
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