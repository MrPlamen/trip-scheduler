import request from "../utils/request";

const baseUrl = 'http://localhost:3030/jsonstore/comments';

export default {
    async getAll(tripId) {
        const comments = await request.get(baseUrl);

        const tripComments = Object.values(comments).filter(comment => comment.tripId === tripId);

        return tripComments;
    },
    create(email, tripId, comment) {
        return request.post(baseUrl, { email, tripId, comment });
    }
};