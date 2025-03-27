import TripCatalogItem from "./trip-catalog-item/TripCatalogItem";
import { useTrips } from "../../api/tripApi";

export default function TripCatalog() {
    const { trips } = useTrips();

    return (
        <section id="catalog-page">
            <h1>All Trips</h1>

            {trips.length > 0
                ? trips.map(trip => <TripCatalogItem key={trip._id} {...trip} />)
                : <h3 className="no-articles">No trips planned yet</h3>
            }
        </section>
    );
}
