import { Link, useNavigate, useParams } from 'react-router';
import { useEffect, useState, useCallback } from 'react';

import CommentsShow from '../comment-show/CommentsShow';
import CommentsCreate from '../comments-create/CommentsCreate';
import VisitItemsFetcher from '../visit-items/VisitItemsFetcher';

import commentService from '../../services/commentService';
import likesService from '../../services/likesService';
import { useDeleteTrip, useTrip } from '../../api/tripApi';
import { useEditItem } from "../../api/visitItemApi";
import useAuth from '../../hooks/useAuth';

import { shortFormatDate } from "../../utils/dateUtil";
import request from '../../utils/request';

export default function TripDetails() {
    const navigate = useNavigate();
    const { tripId } = useParams();
    const { trip } = useTrip(tripId);
    const { email, _id: userId } = useAuth();
    const { deleteTrip } = useDeleteTrip();
    const { edit } = useEditItem();

    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [newVisitItem, setNewVisitItem] = useState({ title: '', description: '', imageUrl: '' });
    const [selectedVisitItem, setSelectedVisitItem] = useState(null);
    const [visitItemsReloadKey, setVisitItemsReloadKey] = useState(0); // 🔁 trigger reload

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

        fetchComments();
        fetchLikes();
    }, [tripId, email]);

    const likeHandler = async () => {
        try {
            const newLike = { email, tripId, like: true, userId };
            await likesService.createTripLike(email, tripId, true, userId);
            setLikes((prev) => [...prev, newLike]);
            setIsLiked(true);
        } catch (error) {
            console.error('Error liking the trip:', error);
        }
    };

    const unlikeHandler = async () => {
        try {
            await likesService.delete(email, tripId);
            setLikes((prev) => prev.filter(like => like.email !== email));
            setIsLiked(false);
        } catch (error) {
            console.error('Error unliking the trip:', error);
        }
    };

    const tripDeleteClickHandler = useCallback(async () => {
        const hasConfirm = confirm(`Are you sure you want to delete ${trip.title}?`);
        if (!hasConfirm) return;

        await deleteTrip(tripId);
        navigate('/trips');
    }, [tripId, deleteTrip, navigate, trip.title]);

    const commentCreateHandler = useCallback((newComment) => {
        setComments((prev) => [...prev, newComment]);
    }, []);

    const visitItemSubmitHandler = async (event) => {
        event.preventDefault();
        const members = trip.members;

        const visitItemData = {
            ...newVisitItem,
            tripId,
            members,
            _ownerId: userId,
            _createdOn: Date.now()
        };

        try {
            if (selectedVisitItem) {
                await edit(selectedVisitItem._id, visitItemData);
            } else {
                await request.post('http://localhost:3030/jsonstore/visitItems', visitItemData);
            }

            setNewVisitItem({ title: '', description: '', imageUrl: '' });
            setSelectedVisitItem(null);
            setVisitItemsReloadKey(prev => prev + 1); // 🔁 reload visit items
        } catch (error) {
            console.error('Error saving visit item:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewVisitItem(prev => ({ ...prev, [name]: value }));
    };

    const editVisitItemHandler = (visitItem) => {
        setSelectedVisitItem(visitItem);
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
                        <span className="levels">
                            <b>{shortFormatDate(trip.startDate)} - {shortFormatDate(trip.endDate)}</b>
                            {` (${trip.duration} days)`}
                        </span>
                        <br />
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
            <VisitItemsFetcher
                tripId={tripId}
                email={email}
                userId={userId}
                onLike={likeHandler}
                onEdit={editVisitItemHandler}
                onAddComment={commentCreateHandler}
                reloadTrigger={visitItemsReloadKey}
            />

            {/* Create Visit Item Section */}
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
                        <button type="submit" className="button">
                            {selectedVisitItem ? 'Save Changes' : 'Create Visit Item'}
                        </button>
                    </form>
                </section>
            )}
        </>
    );
}
