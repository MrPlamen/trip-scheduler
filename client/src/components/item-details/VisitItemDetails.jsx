import { Link, useNavigate, useParams } from 'react-router';
import { useDeleteItem, useVisitItem, useEditItem } from "../../api/visitItemApi";
import { useTrip } from "../../api/tripApi";
import itemLikesService from "../../services/itemLikesService";
import { useCallback, useEffect, useState } from "react";
import useAuth from '../../hooks/useAuth';
import commentService from '../../services/commentService';
import CommentsShow from '../comment-show/CommentsShow';
import CommentsCreate from '../comments-create/CommentsCreate';

export default function VisitItemDetails() {
    const { visitItemId } = useParams();
    const { visitItem, refetchVisitItem } = useVisitItem(visitItemId);
    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const { email, _id: userId } = useAuth();
    const { deleteItem } = useDeleteItem();
    const { edit } = useEditItem();
    const navigate = useNavigate();
    const [newVisitItem, setNewVisitItem] = useState({
        title: '',
        description: '',
        imageUrl: ''
    });
    const [selectedVisitItem, setSelectedVisitItem] = useState(null);

    // If visitItem is not yet fetched
    if (!visitItem) {
        return <div>Visit item not found!</div>;
    }

    const timestamp = visitItem._createdOn;
    const date = new Date(timestamp);
    const trip = visitItem.tripId;

    const { trip: tripDetails } = useTrip(trip);
    const tripTitle = tripDetails.title;

    // Fetch comments and likes based on tripId
    useEffect(() => {
        const fetchComments = async () => {
            const fetchedComments = await commentService.getAll(visitItemId);
            setComments(fetchedComments);
        };

        const fetchLikes = async () => {
            const fetchedLikes = await itemLikesService.getAll(visitItemId);
            setLikes(fetchedLikes);
            setIsLiked(fetchedLikes.some(like => like.email === email));
        };

        fetchComments();
        fetchLikes();
    }, [visitItemId, email]);

    const commentCreateHandler = useCallback((newComment) => {
        setComments((prevState) => [...prevState, newComment]);
    }, []);

    const likeHandler = async () => {
        try {
            const newLike = { email, visitItemId, like: true, userId };
            await itemLikesService.createItemLike(email, visitItemId, true, userId);
            setLikes((prevLikes) => [...prevLikes, newLike]);
            setIsLiked(true);
        } catch (error) {
            console.error('Error liking the trip:', error);
        }
    };

    const unlikeHandler = async () => {
        try {
            await itemLikesService.delete(email, visitItemId);
            setLikes((prevLikes) => prevLikes.filter(like => like.email !== email));
            setIsLiked(false);
        } catch (error) {
            console.error('Error unliking the trip:', error);
        }
    };

    const itemDeleteClickHandler = useCallback(async () => {
        const hasConfirm = confirm(`Are you sure you want to delete ${visitItem.title}?`);
        if (!hasConfirm) return;

        await deleteItem(visitItemId);
        navigate('/visits');
    }, [visitItemId, deleteItem, navigate, visitItem.title]);

    const visitItemSubmitHandler = async (event) => {
        event.preventDefault();
    
        const members = visitItem.members;  // Preserve the current members
    
        const visitItemData = {
            ...visitItem,  // Spread the original visitItem data to preserve all properties
            ...newVisitItem,  // Spread the updated properties (title, description, imageUrl)
            members,
            _ownerId: userId,
            _createdOn: visitItem._createdOn,  // Keep the original creation timestamp
        };
    
        try {
            if (selectedVisitItem) {
                // Edit existing visit item
                await edit(selectedVisitItem._id, visitItemData);
                // Manually trigger refetch
                refetchVisitItem(); // This will re-fetch the updated visit item
            }
    
            setNewVisitItem({ title: '', description: '', imageUrl: '' });  // Clear the form
            setSelectedVisitItem(null); // Clear the selected item after submission
        } catch (error) {
            console.error('Error saving visit item:', error);
        }
    };       
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewVisitItem((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const editVisitItemHandler = (visitItem) => {
        setSelectedVisitItem(visitItem);  
        setNewVisitItem({
            title: visitItem.title,
            description: visitItem.description,
            imageUrl: visitItem.imageUrl
        });
    };

    const isOwner = userId === visitItem?._ownerId;
    const isMember = Array.isArray(visitItem.members) && visitItem.members.includes(email);

    return (
        <section id="trip-details">
            <h1>{tripTitle} trip:</h1>
            <h2>Visit Point Details</h2>
            <div className="info-section">
                <div className="trip-header">
                    <img className="trip-img" src={visitItem.imageUrl} alt={visitItem.title} />
                    <h1>{visitItem.title}</h1>
                    <span className="levels">Created on: {date.toLocaleDateString()}</span>
                    <p className="type">{visitItem.category}</p>
                    <p className="text">{visitItem.description}</p>
                </div>

                <div className="likes-section">
                    <p>{likes.length} likes</p>
                    {isLiked ? (
                        <button onClick={unlikeHandler} className="button">Unlike</button>
                    ) : (
                        <button onClick={likeHandler} className="button">Like</button>
                    )}
                </div>

                <CommentsShow comments={comments} />

                {isOwner && (
                    <div className="buttons">
                        <button onClick={() => editVisitItemHandler(visitItem)} className="button">Edit</button>
                        <button onClick={itemDeleteClickHandler} className="button">Delete</button>
                    </div>
                )}

                <CommentsCreate
                    email={email}
                    tripId={visitItemId}
                    onCreate={commentCreateHandler}
                />
            </div>

            {isMember && (
                <section id="create-visit-item">
                    <h2>{selectedVisitItem ? 'Edit Visit Item' : 'Create Visit Item'}</h2>
                    <form onSubmit={visitItemSubmitHandler}>
                        <div>
                            <label htmlFor="title">Title:</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={newVisitItem.title}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description">Description:</label>
                            <textarea
                                id="description"
                                name="description"
                                value={newVisitItem.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="imageUrl">Image URL:</label>
                            <input
                                type="url"
                                id="imageUrl"
                                name="imageUrl"
                                value={newVisitItem.imageUrl}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <button type="submit" className="button">{selectedVisitItem ? 'Save Changes' : 'Create Visit Item'}</button>
                    </form>
                </section>
            )}
        </section>
    );
}
