import { useParams } from "react-router";
import { useVisitItem } from "../../api/visitItemApi";
import { useTrip } from "../../api/tripApi";

export default function VisitItemDetails() {
    const { visitItemId } = useParams();
    const { visitItem } = useVisitItem(visitItemId);

    if (!visitItem) {
        return <div>Visit item not found!</div>;
    }

    const timestamp = visitItem._createdOn;
    const date = new Date(timestamp);
    const trip = visitItem.tripId;

    console.log(`trip id: ${trip}`);
    const { trip: tripDetails } = useTrip(trip);
    const tripTitle = tripDetails.title;

    return (
        <section id="trip-details">
            <h1>{tripTitle} trip:</h1>
            <h2>Visit Point Details</h2>
            <div className="info-section">
                <div className="trip-header">
                    <img className="trip-img" src={visitItem.imageUrl} alt={visitItem.title} />
                    <h1>{visitItem.title}</h1>
                    <span className="levels">Created on: {date.toLocaleDateString()}</span>
                    <p className="type">{visitItem.category}</p>
                </div>

                <p className="text">{visitItem.description}</p>
            </div>
        </section>
    );
}
