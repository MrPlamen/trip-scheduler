import request from "../utils/request";

const baseUrl = 'http://localhost:3030/jsonstore/likes';

export default {
    async getAll(tripId) {
        const likes = await request.get(baseUrl);

        const tripLikes = Object.values(likes).filter(like => like.tripId === tripId);

        return tripLikes;
    },
    create(email, tripId, like) {
        return request.post(baseUrl, { email, tripId, like });
    },

    async delete(email, tripId) {
        const likes = await request.get(baseUrl);
        const tripLikes = Object.values(likes).filter(like => like.tripId === tripId && like.email === email);

        if (tripLikes.length > 0) {
            const likeId = tripLikes[0]._id; 
            await request.delete(`${baseUrl}/${likeId}`); 
        }
    }
};