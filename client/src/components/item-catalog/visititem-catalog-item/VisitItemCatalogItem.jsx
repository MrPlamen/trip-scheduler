import { Link } from 'react-router'

export default function VisitItemCatalogItem({
    _id,
    title,
    category,
    imageUrl,
    description
}) {
    return (
        <div className="allGames">
            <div className="allGames-info">
                <img src={imageUrl} />
                <h2>{title}</h2>
                <h6>{category}</h6>
                <p>{description}</p>
                <Link to={`/trips/${_id}/details`} className="details-button">Details</Link>
            </div>
        </div>
    );
}
