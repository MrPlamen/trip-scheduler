import { useNavigate } from 'react-router';

import { useCreateTrip } from '../../api/tripApi';

export default function TripCreate() {
    const navigate = useNavigate();
    const { create: createTrip } = useCreateTrip();

    const submitAction = async (formData) => {
        const tripData = Object.fromEntries(formData);

        await createTrip(tripData);

        navigate('/trips');
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

                    <label htmlFor="trip-img">Image:</label>
                    <input type="text" id="imageUrl" name="imageUrl" placeholder="Upload a photo..." />

                    <label htmlFor="summary">Summary:</label>
                    <textarea name="summary" id="summary"></textarea>
                    <input className="btn submit" type="submit" value="Create" />
                </div>
            </form>
        </section>
    );
}