import { Link } from "react-router";
import { useLatestTrips } from "../../api/tripApi";

export default function Home() {
    const { latestTrips } = useLatestTrips();

    return (
        <section id="welcome-world">
            <div className="welcome-message">
                <h2>Welcome</h2>
            </div>

            <div id="home-page">
                <h1>Latest Trips</h1>

                {latestTrips.map(trip => (
                    <div className="trip" key={trip._id}>
                        <div className="image-wrap">
                            <img src={trip.imageUrl} />
                        </div>
                        <h3>{trip.title}</h3>
                        <div className="rating">
                            <span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
                        </div>
                        <div className="data-buttons">
                            <Link to={`/trips/${trip._id}/details`} className="btn details-btn">Details</Link>
                        </div>
                    </div>
                ))}


                {latestTrips.length === 0 && <p className="no-articles">No trips yet</p>}
            </div>
        </section >
    );
}