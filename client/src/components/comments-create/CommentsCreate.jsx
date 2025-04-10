import commentService from "../../services/commentService";

export default function CommentsCreate({
    email,
    tripId,
    onCreate,
}) {
    const commentAction = async (formData) => {
        const comment = formData.get('comment');

        const createdComment = await commentService.create(email, tripId, comment);

        onCreate(createdComment);
    }

    return (
        <article className="create-comment">
            <h3 className="comment-heading">Add a new comment</h3>
            <form className="comment-form" action={commentAction}>
                <div className="form-group">
                    <label htmlFor="comment" className="form-label"></label>
                    <textarea
                        id="comment"
                        name="comment"
                        placeholder="Write your thoughts here..."
                        className="form-textarea"
                        rows="4"
                        required
                    ></textarea>
                </div>
                <div className="form-actions">
                    <input
                        type="submit"
                        value="Add Comment"
                        className="btn submit-btn"
                    />
                </div>
            </form>
        </article>

    );
}