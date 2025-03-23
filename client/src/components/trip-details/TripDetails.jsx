import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import tripService from '../../services/tripService';

export default function TripDetails() {
    const navigate = useNavigate();
    const [trip, setTrip] = useState({});
    const { tripId } = useParams();

    useEffect(() => {
        (async() => {
            const result = await tripService.getOne(tripId);
            setTrip(result);
        })();
    }, [tripId]);

    const tripDeleteClickHandler = async () => {
        const hasConfirm = confirm(`Are you sure you want to delete ${trip.title}?`);

        if (!hasConfirm) {
            return;
        }

        await tripService.delete(tripId);

        navigate('/trips');
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

                {/* <!-- Bonus ( for Guests and Users ) --> */}
                <div className="details-comments">
                    <h2>Comments:</h2>
                    <ul>
                        {/* <!-- list all comments for current trip (If any) --> */}
                        <li className="comment">
                            <p>Content: I rate this one quite highly.</p>
                        </li>
                        <li className="comment">
                            <p>Content: The best trip.</p>
                        </li>
                    </ul>
                    {/* <!-- Display paragraph: If there are no trips in the database --> */}
                    <p className="no-comment">No comments.</p>
                </div>

                {/* <!-- Edit/Delete buttons ( Only for creator of this trip )  --> */}
                <div className="buttons">
                    <Link to={`/trips/${tripId}/edit`} className="button">Edit</Link>
                    <button onClick={tripDeleteClickHandler} className="button">Delete</button> 
                    {/* TODO: Make it a link to modal for delete confirmation */}
                </div>
            </div>

            {/* <!-- Bonus --> */}
            {/* <!-- Add Comment ( Only for logged-in users, which is not creators of the current trip ) --> */}
            <article className="create-comment">
                <label>Add new comment:</label>
                <form className="form">
                    <textarea name="comment" placeholder="Comment......"></textarea>
                    <input className="btn submit" type="submit" value="Add Comment" />
                </form>
            </article>

        </section>
    );
}