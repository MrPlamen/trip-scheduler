import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";  
import TripCatalogItem from "./trip-catalog-item/TripCatalogItem";
import { useTrips } from "../../api/tripApi";

export default function TripCatalog() {
    const { trips } = useTrips(); 
    const { email } = useContext(UserContext);  

    const userTrips = trips.filter(trip => Array.isArray(trip.members) && trip.members.includes(email));

    return (
        <section id="catalog-page">
            <h1>Trips You Are a Part Of</h1>

            {userTrips.length > 0
                ? userTrips.map(trip => <TripCatalogItem key={trip._id} {...trip} />)
                : <h3 className="no-articles">You are not a member of any trips yet.</h3>
            }
        </section>
    );
}
