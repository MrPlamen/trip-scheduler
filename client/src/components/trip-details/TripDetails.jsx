import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import tripService from '../../services/tripService';
import CommentsShow from '../comment-show/CommentsShow';
import CommentsCreate from '../comments-create/CommentsCreate';
import commentService from '../../services/commentService';

export default function TripDetails({
    email
}) {
    const navigate = useNavigate();
    const [trip, setTrip] = useState({});
    const [comments, setComments] = useState([]);
    const { tripId } = useParams();

    useEffect(() => {
            tripService.getOne(tripId)
                .then(setTrip);

            commentService.getAll(tripId)
                .then(setComments)    
    }, [tripId]);

    const tripDeleteClickHandler = async () => {
        const hasConfirm = confirm(`Are you sure you want to delete ${trip.title}?`);

        if (!hasConfirm) {
            return;
        }

        await tripService.delete(tripId);

        navigate('/trips');
    };

    const commentCreateHandler = (newComment) => {
        setComments(state => [...state, newComment]);
    }

    return (
        <section id="game-details">
            <h1>Trip Details</h1>
            <div className="info-section">

                <div className="game-header">
                    <img className="game-img" src={trip.imageUrl} />
                    <h1>{trip.title}</h1>
                    <span className="levels">Duration: {trip.duration}</span>
                    <p className="type">{trip.category}</p>
                </div>

                <p className="text">{trip.summary}</p>

                <CommentsShow comments={comments}/>

                {/* <!-- Edit/Delete buttons ( Only for creator of this trip )  --> */}
                <div className="buttons">
                    <Link to={`/trips/${tripId}/edit`} className="button">Edit</Link>
                    <button onClick={tripDeleteClickHandler} className="button">Delete</button> 
                    {/* TODO: Make it a link to modal for delete confirmation */}
                </div>
            </div>

            <CommentsCreate 
            email={email} 
            tripId={tripId}
            onCreate = {commentCreateHandler}
            />

        </section>
    );
}