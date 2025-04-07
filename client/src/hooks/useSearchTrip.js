import { useEffect, useState } from "react";
import request from "../utils/request";

const baseUrl = `http://localhost:3030/data/trips`;

export const useSearchTrip = (memberEmail) => {
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTripsByMember = async () => {
            try {
                // Fetch all trips
                const trips = await request.get(baseUrl);
                
                // Filter trips where memberEmail exists in the members array
                const tripsWithMember = trips.filter(trip =>
                    trip.members && trip.members.includes(memberEmail) // Adjust the condition based on how members are stored
                );
                
                // Set the filtered trips to state
                setFilteredTrips(tripsWithMember);
            } catch (error) {
                setError("Failed to fetch trips.");
                console.error("Error fetching trips:", error);
            }
        };

        if (memberEmail) {
            fetchTripsByMember();
        }
    }, [memberEmail]); // Re-run when memberEmail changes

    return { filteredTrips, error };
};
