import './VisitItems.css';

export default function VisitItems({ visitItems }) {
    // Convert the visitItems object to an array if it is an object
    const visitItemsArray = Object.values(visitItems);

    console.log('Received visit items:', visitItemsArray);  // Check if it's an array

    return (
        <div id="visit-items">
            <h2>Visit Items</h2>
            {visitItemsArray.length > 0 ? (
                visitItemsArray.map(item => (
                    <div key={item._id} className="visit-item-card"> {/* Unique key for each visit item */}
                        <img src={item.imageUrl} alt={item.title} />
                        <h3>{item.title}</h3>
                        <p>{item.summary}</p> {/* Ensure the correct property */}
                        <span>Likes: {item.likes}</span>
                        {/* Comments */}
                        {item.comments && item.comments.length > 0 && (
                            <div>
                                {item.comments.map((comment, index) => (
                                    <div key={comment._id || index}> {/* Use _id if available, otherwise index */}
                                        <p>{comment.content}</p>
                                        <small>by {comment.userId}</small>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>No visit items for this trip yet.</p>
            )}
        </div>
    );
}
