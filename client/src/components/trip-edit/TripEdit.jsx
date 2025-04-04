import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { useEditTrip, useTrip } from "../../api/tripApi";

export default function TripEdit() {
    const navigate = useNavigate();
    const { tripId } = useParams();
    const { trip, loading, error } = useTrip(tripId);  // Assuming you have loading and error states from useTrip hook
    const { edit } = useEditTrip();

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        duration: '',
        imageUrl: '',
        members: '',
        summary: ''
    });

    // Populate form data with existing trip info when the trip is loaded
    useEffect(() => {
        if (trip) {
            setFormData({
                title: trip.title || '',
                category: trip.category || '',
                duration: trip.duration || '',
                imageUrl: trip.imageUrl || '',
                members: trip.members?.join(', ') || '',  // Assuming members is an array
                summary: trip.summary || ''
            });
        }
    }, [trip]);

    // Handle form data input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Form submission action
    const formAction = async (e) => {
        e.preventDefault();

        // Prepare trip data to send
        const { members, ...tripData } = formData;
        const membersEmails = members ? members.split(', ').map(email => email.trim()) : [];

        const tripToEdit = {
            ...tripData,
            members: membersEmails,
        };

        await edit(tripId, tripToEdit);

        // Navigate to trip details after editing
        navigate(`/trips/${tripId}/details`);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading trip: {error.message}</p>;
    }

    return (
        <section id="edit-page" className="auth">
            <form id="edit" onSubmit={formAction}>
                <div className="container">
                    <h1>Edit trip</h1>
                    
                    <label htmlFor="title">Legendary title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="category">Category:</label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="duration">MaxLevel:</label>
                    <input
                        type="number"
                        id="duration"
                        name="duration"
                        min="1"
                        value={formData.duration}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="imageUrl">Image:</label>
                    <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="members">Trip members:</label>
                    <input
                        name="members"
                        id="members"
                        placeholder="Add members..."
                        value={formData.members}
                        onChange={handleInputChange}
                    />

                    <label htmlFor="summary">Summary:</label>
                    <textarea
                        name="summary"
                        id="summary"
                        value={formData.summary}
                        onChange={handleInputChange}
                        required
                    ></textarea>

                    <input className="btn submit" type="submit" value="Edit trip" />
                </div>
            </form>
        </section>
    );
}
