import { Link } from 'react-router'

export default function TripCatalogItem({
    _id,
    title,
    category,
    imageUrl,
    length,
    summary
}) {
    return (
        <div className="allGames">
            <div className="allGames-info">
                <img src={imageUrl} />
                <h2>{title}</h2>
                <h6>{category}</h6>
                <h6>{`${length} days`}</h6>
                <p>{summary}</p>
                <Link to={`/trips/${_id}/details`} className="details-button">Details</Link>
            </div>
        </div>
    );
}
