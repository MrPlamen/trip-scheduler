import { Link, useNavigate, useParams } from 'react-router';
import CommentsShow from '../comment-show/CommentsShow';
import CommentsCreate from '../comments-create/CommentsCreate';
import commentService from '../../services/commentService';
import { useDeleteTrip, useTrip } from '../../api/tripApi';
import useAuth from '../../hooks/useAuth';
import { useEffect, useState, useCallback } from 'react';

export default function TripDetails() {
    const navigate = useNavigate();
    const { email, _id: userId } = useAuth();
    const { tripId } = useParams();
    const { trip } = useTrip(tripId);
    const { deleteTrip } = useDeleteTrip();
    
    const [comments, setComments] = useState([]);
    
    useEffect(() => {
        const fetchComments = async () => {
            const fetchedComments = await commentService.getAll(tripId);
            setComments(fetchedComments);
        };

        fetchComments();
    }, [tripId]);

    const tripDeleteClickHandler = useCallback(async () => {
        const hasConfirm = confirm(`Are you sure you want to delete ${trip.title}?`);
        
        if (!hasConfirm) return;

        await deleteTrip(tripId);
        navigate('/trips');
    }, [tripId, deleteTrip, navigate, trip.title]);

    const commentCreateHandler = useCallback((newComment) => {
        setComments((prevState) => [...prevState, newComment]);
    }, []);

    const isOwner = userId === trip?._ownerId;

    return (
        <section id="game-details">
            <h1>Trip Details</h1>
            <div className="info-section">

                <div className="game-header">
                    <img className="game-img" src={trip.imageUrl} alt={trip.title} />
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
            </div>

            <CommentsCreate 
                email={email} 
                tripId={tripId}
                onCreate={commentCreateHandler}
            />
        </section>
    );
}
