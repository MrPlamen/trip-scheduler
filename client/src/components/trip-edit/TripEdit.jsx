import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import tripService from "../../services/tripService";

export default function TripEdit() {
    const navigate = useNavigate();
    const { tripId } = useParams();
    const [trip, setTrip] = useState({});

    useEffect(() => {
        tripService.getOne(tripId)
        .then(setTrip);
    }, [tripId]);

    return (
        <section id="edit-page" className="auth">
            <form id="edit">
                <div className="container">

                    <h1>Edit trip</h1>
                    <label htmlFor="leg-title">Legendary title:</label>
                    <input type="text" id="title" name="title" defaultValue={trip.title} />

                    <label htmlFor="category">Category:</label>
                    <input type="text" id="category" name="category" defaultValue={trip.category} />

                    <label htmlFor="duration">MaxLevel:</label>
                    <input type="number" id="duration" name="duration" min="1" defaultValue={trip.duration} />

                    <label htmlFor="game-img">Image:</label>
                    <input type="text" id="imageUrl" name="imageUrl" defaultValue={trip.imageUrl} />

                    <label htmlFor="summary">Summary:</label>
                    <textarea name="summary" id="summary" defaultValue={trip.summary}></textarea>
                    <input className="btn submit" type="submit" defaultValue="Edit trip" />

                </div>
            </form>
        </section>
    );
}