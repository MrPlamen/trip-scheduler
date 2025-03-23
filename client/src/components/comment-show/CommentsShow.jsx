export default function CommentsShow() {
    return (
        <div className="details-comments">
            <h2>Comments:</h2>
            <ul>
                <li className="comment">
                    <p>Content: I rate this one quite highly.</p>
                </li>
                <li className="comment">
                    <p>Content: The best trip.</p>
                </li>
            </ul>
            <p className="no-comment">No comments.</p>
        </div>
    );
}