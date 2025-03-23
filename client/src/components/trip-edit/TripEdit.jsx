import { useNavigate, useParams } from "react-router";

export default function TripEdit() {
    const navigate = useNavigate();
    const { tripId } = useParams();

    return (
        <section id="edit-page" className="auth">
            <form id="edit">
                <div className="container">

                    <h1>Edit trip</h1>
                    <label htmlFor="leg-title">Legendary title:</label>
                    <input type="text" id="title" name="title" value="" />

                    <label htmlFor="category">Category:</label>
                    <input type="text" id="category" name="category" value="" />

                    <label htmlFor="duration">MaxLevel:</label>
                    <input type="number" id="duration" name="duration" min="1" value="" />

                    <label htmlFor="game-img">Image:</label>
                    <input type="text" id="imageUrl" name="imageUrl" value="" />

                    <label htmlFor="summary">Summary:</label>
                    <textarea name="summary" id="summary"></textarea>
                    <input className="btn submit" type="submit" value="Edit Game" />

                </div>
            </form>
        </section>
    );
}