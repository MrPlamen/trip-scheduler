import { Link, useNavigate, useParams } from 'react-router';
import { useDeleteItem, useVisitItem } from "../../api/visitItemApi";
import { useTrip } from "../../api/tripApi";
import itemLikesService from "../../services/itemLikesService";
import { useCallback, useEffect, useState } from "react";
import useAuth from '../../hooks/useAuth';

export default function VisitItemDetails() {
    const { visitItemId } = useParams();
    const { visitItem } = useVisitItem(visitItemId);
    const [likes, setLikes] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const { email, _id: userId } = useAuth();
    const { deleteItem } = useDeleteItem();
    const navigate = useNavigate();

    if (!visitItem) {
        return <div>Visit item not found!</div>;
    }

    const timestamp = visitItem._createdOn;
    const date = new Date(timestamp);
    const trip = visitItem.tripId;

    const { trip: tripDetails } = useTrip(trip);
    const tripTitle = tripDetails.title;

    // Fetch comments and likes based on tripId
    useEffect(() => {
        // const fetchComments = async () => {
        //     const fetchedComments = await commentService.getAll(tripId);
        //     setComments(fetchedComments);
        // };

        const fetchLikes = async () => {
            const fetchedLikes = await itemLikesService.getAll(visitItemId);
            setLikes(fetchedLikes);
            setIsLiked(fetchedLikes.some(like => like.email === email));
        };

        // const fetchVisitItems = async () => {
        //     try {
        //         const fetchedVisitItems = await request.get('http://localhost:3030/jsonstore/visitItems');

        //         if (fetchedVisitItems) {
        //             const filteredVisitItems = Object.values(fetchedVisitItems).filter(item => item.tripId === tripId);
        //             setVisitItems(filteredVisitItems);
        //         } else {
        //             setVisitItems([]);
        //         }
        //     } catch (error) {
        //         console.error('Error fetching visit items:', error);
        //     }
        // };

        // fetchComments();
        fetchLikes();
        // fetchVisitItems();
    }, [visitItemId, email]);

    const likeHandler = async () => {
        try {
            const newLike = { email, visitItemId, like: true, userId };
            await itemLikesService.createItemLike(email, visitItemId, true, userId);
            setLikes((prevLikes) => [...prevLikes, newLike]);
            setIsLiked(true);
        } catch (error) {
            console.error('Error liking the trip:', error);
        }
    };

    const unlikeHandler = async () => {
        try {
            await itemLikesService.delete(email, visitItemId);
            setLikes((prevLikes) => prevLikes.filter(like => like.email !== email));
            setIsLiked(false);
        } catch (error) {
            console.error('Error unliking the trip:', error);
        }
    };

    const itemDeleteClickHandler = useCallback(async () => {
        const hasConfirm = confirm(`Are you sure you want to delete ${visitItem.title}?`);
        if (!hasConfirm) return;

        await deleteItem(visitItemId);
        navigate('/visits');
    }, [visitItemId, deleteItem, navigate, visitItem.title]);

    const isOwner = userId === visitItem?._ownerId;
    const isMember = Array.isArray(visitItem.members) && visitItem.members.includes(email);

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

                <div className="likes-section">
                    <p>{likes.length} likes</p>
                    {isLiked ? (
                        <button onClick={unlikeHandler} className="button">Unlike</button>
                    ) : (
                        <button onClick={likeHandler} className="button">Like</button>
                    )}
                </div>

                {/* <CommentsShow comments={comments} /> */}

                {isOwner && (
                    <div className="buttons">
                        {/* <Link to={`/trips/${tripId}/edit`} className="button">Edit</Link> */}
                        <button onClick={itemDeleteClickHandler} className="button">Delete</button>
                    </div>
                )}

                <p className="text">{visitItem.description}</p>
            </div>
        </section>
    );
}
