import { useState } from "react";
import { useSearchTrip } from "../../hooks/useSearchTrip";
import { useSearchVisitItem } from "../../hooks/useSearchVisitItem";

const Search = () => {
    const [memberEmail, setMemberEmail] = useState("");  // Replace with actual member ID to search for
    const { filteredTrips, error } = useSearchTrip(memberEmail);
    const { filteredItems, errorItem } = useSearchVisitItem(memberEmail);

    return (
        <div>
            <h2>Search Trips</h2>

            <input
                type="text"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="Enter member ID to search"
            />

            {error && <p>{error}</p>}

            <div className="search-results search-trips">
                <ul>
                    {filteredTrips.length > 0 ? (
                        filteredTrips.map((trip) => (
                            <li key={trip._id}>
                                <img
                                    src={trip.imageUrl}
                                    alt={trip.title}
                                    style={{ width: '200px', height: 'auto' }} // You can adjust the size as needed
                                />
                                <p>{trip.title}</p> {/* Display the title of the trip */}
                            </li>
                        ))
                    ) : (
                        <p>No trips found for this member.</p>
                    )}
                </ul>
            </div>

            <div className="search-results search-visit-points">
                <ul>
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <li key={item._id}>
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    style={{ width: '200px', height: 'auto' }} // You can adjust the size as needed
                                />
                                <p>{item.title}</p> {/* Display the title of the trip */}
                            </li>
                        ))
                    ) : (
                        <p>No visit points yet for this member.</p>
                    )}
                </ul>
            </div>

        </div>
    );
};

export default Search;
