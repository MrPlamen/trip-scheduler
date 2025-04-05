import { useParams } from "react-router";
import { useVisitItem } from "../../api/visitItemApi"; // Updated hook

export default function VisitItemDetails() {
    const { visitItemId } = useParams();
    const { visitItem, isLoading, error } = useVisitItem(visitItemId);

    // Log for debugging purposes
    console.log(`params id: ${visitItemId}`);
    console.log(`visit point: ${visitItem}`);

    // Handle loading state
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Handle error state
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Handle no visitItem found
    if (!visitItem) {
        return <div>Visit item not found!</div>;
    }

    return (
        <section id="trip-details">
            <h1>Visit Point Details</h1>
            <div className="info-section">
                <div className="trip-header">
                    <img className="trip-img" src={visitItem.imageUrl} alt={visitItem.title} />
                    <h1>{visitItem.title}</h1>
                    <span className="levels">Duration: {visitItem.duration}</span>
                    <p className="type">{visitItem.category}</p>
                </div>

                <p className="text">{visitItem.description}</p>
            </div>
        </section>
    );
}
