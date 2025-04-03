import { Link, useNavigate, useParams } from 'react-router';
import CommentsShow from '../comment-show/CommentsShow';
import CommentsCreate from '../comments-create/CommentsCreate';
import commentService from '../../services/commentService';
import { useDeleteTrip, useTrip } from '../../api/tripApi';
import useAuth from '../../hooks/useAuth';
import { useEffect, useState, useCallback } from 'react';
import likesService from '../../services/likesService';
import VisitItems from '../visit-items/VisitItems';
import { useEditItem } from "../../api/visitItemApi";

import request from '../../utils/request';

export default function TripDetails() {
    const navigate = useNavigate();
    const { email, _id: userId } = useAuth();
    const { tripId } = useParams();
    const { trip } = useTrip(tripId);
    const { deleteTrip } = useDeleteTrip();
    const { edit } = useEditItem();

    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [visitItems, setVisitItems] = useState([]);
    const [newVisitItem, setNewVisitItem] = useState({
        title: '',
        description: '',
        imageUrl: ''
    });
    const [selectedVisitItem, setSelectedVisitItem] = useState(null);

    // Fetch comments and likes based on tripId
    useEffect(() => {
        const fetchComments = async () => {
            const fetchedComments = await commentService.getAll(tripId);
            setComments(fetchedComments);
        };

        const fetchLikes = async () => {
            const fetchedLikes = await likesService.getAll(tripId);
            setLikes(fetchedLikes);
            setIsLiked(fetchedLikes.some(like => like.email === email));
        };

        const fetchVisitItems = async () => {
            try {
                const fetchedVisitItems = await request.get('http://localhost:3030/jsonstore/visitItems');

                if (fetchedVisitItems) {
                    const filteredVisitItems = Object.values(fetchedVisitItems).filter(item => item.tripId === tripId);
                    setVisitItems(filteredVisitItems);
                } else {
                    setVisitItems([]);
                }
            } catch (error) {
                console.error('Error fetching visit items:', error);
            }
        };

        fetchComments();
        fetchLikes();
        fetchVisitItems();
    }, [tripId, email]);

    // Handle like
    const likeHandler = async () => {
        try {
            const newLike = { email, tripId, like: true, userId };
            await likesService.createTripLike(email, tripId, true, userId);
            setLikes((prevLikes) => [...prevLikes, newLike]);
            setIsLiked(true);
        } catch (error) {
            console.error('Error liking the trip:', error);
        }
    };

    // Handle unlike
    const unlikeHandler = async () => {
        try {
            await likesService.delete(email, tripId);
            setLikes((prevLikes) => prevLikes.filter(like => like.email !== email));
            setIsLiked(false);
        } catch (error) {
            console.error('Error unliking the trip:', error);
        }
    };

    // Handle trip deletion
    const tripDeleteClickHandler = useCallback(async () => {
        const hasConfirm = confirm(`Are you sure you want to delete ${trip.title}?`);
        if (!hasConfirm) return;

        await deleteTrip(tripId);
        navigate('/trips');
    }, [tripId, deleteTrip, navigate, trip.title]);

    // Handle comment creation
    const commentCreateHandler = useCallback((newComment) => {
        setComments((prevState) => [...prevState, newComment]);
    }, []);

    // Handle visit item creation
    const visitItemCreateHandler = async (event) => {
        event.preventDefault();

        // Construct the new visit item data
        const newItem = {
            ...newVisitItem,
            tripId,
            _ownerId: userId,  // Assuming the current user is the owner
            _createdOn: Date.now()
        };

        try {
            // POST request to create a new visit item
            await request.post('http://localhost:3030/jsonstore/visitItems', newItem);

            // Update state to include the new visit item
            setVisitItems((prevState) => [...prevState, newItem]);

            // Clear the form fields after submission
            setNewVisitItem({
                title: '',
                description: '',
                imageUrl: ''
            });

            console.log('Visit item created successfully');
        } catch (error) {
            console.error('Error creating visit item:', error);
        }
    };

    const visitItemSubmitHandler = async (event) => {
        event.preventDefault();

        const visitItemData = {
            ...newVisitItem,
            tripId,
            _ownerId: userId,
            _createdOn: Date.now()
        };

        try {
            if (selectedVisitItem) {
                // Edit existing visit item
                await edit(selectedVisitItem._id, visitItemData);
                setVisitItems((prevState) =>
                    prevState.map(item => item._id === selectedVisitItem._id ? visitItemData : item)
                );
            } else {
                // Create new visit item
                await request.post('http://localhost:3030/jsonstore/visitItems', visitItemData);
                setVisitItems((prevState) => [...prevState, visitItemData]);
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
        setSelectedVisitItem(visitItem);  // This will now work as setSelectedVisitItem is defined
        setNewVisitItem({
            title: visitItem.title,
            description: visitItem.description,
            imageUrl: visitItem.imageUrl
        });
    };


    const isOwner = userId === trip?._ownerId;
    const isMember = Array.isArray(trip.members) && trip.members.includes(email);

    return (
        <>
            <section id="trip-details">
                <h1>Trip Details</h1>
                <div className="info-section">
                    <div className="trip-header">
                        <img className="trip-img" src={trip.imageUrl} alt={trip.title} />
                        <h1>{trip.title}</h1>
                        <span className="levels">Duration: {trip.duration}</span>
                        <p className="type">{trip.category}</p>
                    </div>

                    <p className="text">{trip.summary}</p>

                    <CommentsShow comments={comments} />

                    {isOwner && (
                        <div className="buttons">
                            <Link to={`/trips/${tripId}/edit`} className="button">Edit</Link>
                            <button onClick={tripDeleteClickHandler} className="button">Delete</button>
                        </div>
                    )}

                    <div className="likes-section">
                        <p>{likes.length} likes</p>
                        {isLiked ? (
                            <button onClick={unlikeHandler} className="button">Unlike</button>
                        ) : (
                            <button onClick={likeHandler} className="button">Like</button>
                        )}
                    </div>
                </div>

                <CommentsCreate
                    email={email}
                    tripId={tripId}
                    onCreate={commentCreateHandler}
                />
            </section>

            {/* Visit Items Section */}
            <VisitItems
                visitItems={visitItems}
                email={email}
                userId={userId}
                onLike={likeHandler}
                onEdit={editVisitItemHandler}
                onAddComment={commentCreateHandler} />

            {/* Create Visit Item Form Section */}
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
        </>
    );
}
