import { useCallback, useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
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

    // Fetching likes and visit item ids
    useEffect(() => {
        if (!visitItems) return;  // Guard clause to ensure visitItems is not null or undefined
        
        const visitItemIds = Object.values(visitItems).map((item) => item._id);
        setVisitItemId(visitItemIds);

        const fetchLikes = async () => {
            try {
                const fetchedLikes = await request.get('http://localhost:3030/jsonstore/itemLikes');
                setLikes(Object.values(fetchedLikes));  // Store likes data as an array
            } catch (error) {
                console.error('Error fetching likes:', error);
            }
        };

        fetchLikes();
    }, [visitItems, likedItems, isLiked]);  // Re-run when these values change

    // Memoize getLikeCount to optimize performance
    const getLikeCount = useMemo(() => {
        return (visitItemId) => {
            return likes.filter(like => like.visitItemId === visitItemId).length;
        };
    }, [likes]);

    // Handle like action
    const likeHandler = async (visitItemId) => {
        try {
            const newLike = { email, visitItemId, like: true, userId };

            // Call the service to create the like
            await itemLikesService.createItemLike(email, visitItemId, true, userId);

            // Update the likes state
            setLikes((prevLikes) => [...prevLikes, newLike]);

            // Update liked status for this specific item
            setLikedItems((prevLikedItems) => ({
                ...prevLikedItems,
                [visitItemId]: true, // Mark the specific item as liked
            }));

            setIsLiked(true); // This could be removed if not necessary
        } catch (error) {
            console.error('Error liking the item:', error);
        }
    };

    // Handle unlike action
    const unlikeHandler = async (visitItemId) => {
        try {
            await itemLikesService.delete(email, visitItemId);

            // Remove the like from the likes state
            setLikes((prevLikes) => prevLikes.filter(like => like.email !== email || like.visitItemId !== visitItemId));

            setLikedItems((prevLikedItems) => ({
                ...prevLikedItems,
                [visitItemId]: false, // Mark the specific item as unliked
            }));

            setIsLiked(false); // Reset the global liked status
        } catch (error) {
            console.error('Error unliking the item:', error);
        }
    };

    // Handle item deletion
    const itemDeleteClickHandler = useCallback(async (visitItemId) => {
        const hasConfirm = confirm(`Are you sure you want to delete this place for visit?`);
        if (!hasConfirm) return;

        await deleteItem(visitItemId);
        navigate(0);
    }, [deleteItem, navigate]);

    return (
        <div id="visit-items">
            <h2>Visit Items</h2>
            {visitItems && Object.values(visitItems).length > 0 ? (
                Object.values(visitItems).map((item) => {
                    if (!item) return null;  // Ensure item is valid before proceeding

                    const userLikeForItem = likes.find(like => like.email === email && like.visitItemId === item._id);
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
                                        <button onClick={() => itemDeleteClickHandler(item._id)} className="button">Delete</button>
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
