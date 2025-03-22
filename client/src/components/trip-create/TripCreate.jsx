import { useNavigate } from "react-router";
import tripService from "../../services/tripService";

export default function TripCreate() {
    const navigate = useNavigate();

    const submitAction = async (formData) => {
        const tripData = Object.fromEntries(formData);

        try {
            await tripService.create(tripData);
            navigate('/trips');
        } catch (error) {
            console.error("Error creating trip: ", error);
            alert("There was an error creating the trip. Please try again.");
        }
    };

    return (
        <section id="create-page" className="auth">
            <form id="create" action={submitAction}>
                <div className="container">

                    <h1>Create a Trip</h1>
                    <label htmlFor="leg-title">Legendary title:</label>
                    <input type="text" id="title" name="title" placeholder="Enter trip title..." />

                    <label htmlFor="category">Category:</label>
                    <input type="text" id="category" name="category" placeholder="Enter trip category..." />

                    <label htmlFor="duration">Length:</label>
                    <input type="number" id="days" name="duration" min="1" placeholder="1" />

                    <label htmlFor="game-img">Image:</label>
                    <input type="text" id="imageUrl" name="imageUrl" placeholder="Upload a photo..." />

                    <label htmlFor="summary">Summary:</label>
                    <textarea name="summary" id="summary"></textarea>
                    <input className="btn submit" type="submit" value="Create" />
                </div>
            </form>
        </section>
    );
}