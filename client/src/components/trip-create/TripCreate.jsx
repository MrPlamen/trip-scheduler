import { useNavigate } from 'react-router';
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useCreateTrip } from '../../api/tripApi';

export default function TripCreate() {
    const navigate = useNavigate();
    const { create: createTrip } = useCreateTrip(); 
    const { email } = useContext(UserContext);

    const submitAction = async (formData) => {

        const tripData = Object.fromEntries(formData);

        let membersEmails = [];

        if (tripData.members) {
            membersEmails = tripData.members.split(', ').map(email => email.trim());
        }

        tripData.members = [email, ...membersEmails];

        tripData.owner = email;

        await createTrip(tripData);

        navigate('/trips');
    };

    return (
        <section id="create-page" className="auth">
            <form id="create" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                submitAction(formData);
            }}>
                <div className="container">

                    <h1>Create a Trip</h1>
                    <label htmlFor="title">Legendary title:</label>
                    <input type="text" id="title" name="title" placeholder="Enter trip title..." required />

                    <label htmlFor="category">Category:</label>
                    <input type="text" id="category" name="category" placeholder="Enter trip category..." required />

                    <label htmlFor="duration">Length:</label>
                    <input type="number" id="days" name="duration" min="1" placeholder="1" required />

                    <label htmlFor="imageUrl">Image:</label>
                    <input type="text" id="imageUrl" name="imageUrl" placeholder="Upload a photo..." required />
                    
                    <label htmlFor="members">Trip members:</label>
                    <input type="email" name="members" id="members" placeholder="Add members..." />

                    <label htmlFor="summary">Summary:</label>
                    <textarea name="summary" id="summary" required></textarea>

                    <input className="btn submit" type="submit" value="Create" />
                </div>
            </form>
        </section>
    );
}
