import { Link, useNavigate, useParams } from 'react-router';
import CommentsShow from '../comment-show/CommentsShow';
import CommentsCreate from '../comments-create/CommentsCreate';
import commentService from '../../services/commentService';
import { useDeleteTrip, useTrip } from '../../api/tripApi';
import useAuth from '../../hooks/useAuth';
import { useEffect, useState, useCallback } from 'react';
import likesService from '../../services/likesService';
import VisitItems from '../visit-items/VisitItems';
import request from '../../utils/request';

export default function TripDetails() {
    const navigate = useNavigate();
    const { email, _id: userId } = useAuth();
    const { tripId } = useParams();
    const { trip } = useTrip(tripId); 
    const { deleteTrip } = useDeleteTrip();

    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [visitItems, setVisitItems] = useState([]); 

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
                
                console.log(fetchedVisitItems); 
                
                if (fetchedVisitItems) {
                    console.log(Object.values(fetchedVisitItems)[0].title);
                    const filteredVisitItems = Object.values(fetchedVisitItems).filter(item => item._id !== 0);
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
            const newLike = { email, tripId, like: true };
            await likesService.create(email, tripId, true);
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

    const isOwner = userId === trip?._ownerId;

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
                onLike={likeHandler} 
                onAddComment={commentCreateHandler} />
        </>
    );
}
