import { useNavigate, useParams } from "react-router";
import { useEditTrip, useTrip } from "../../api/tripApi";

export default function TripEdit() {
    const navigate = useNavigate();
    const { tripId } = useParams();
    const { trip } = useTrip(tripId);
    const { edit } = useEditTrip();

    const formAction = async (formData) => {
        const tripData = Object.fromEntries(formData);

        await edit(tripId, tripData);

        navigate(`/trips/${tripId}/details`);
    }

    return (
        <section id="edit-page" className="auth">
            <form id="edit" action={formAction}> 
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