import { useParams } from "react-router";
import { useVisitItem } from "../../api/visitItemApi";

export default function VisitItemDetails() {
    const { visitItemId } = useParams();
    const { visitItem, isLoading, error } = useVisitItem(visitItemId);

    console.log(`params id: ${visitItemId}`);
    console.log(`visit point: ${visitItem}`);

    if (!visitItem) {
        return <div>Visit item not found!</div>;
    }

    const timestamp = visitItem._createdOn;

    const date = new Date(timestamp);

    return (
        <section id="trip-details">
            <h1>Visit Point Details</h1>
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
