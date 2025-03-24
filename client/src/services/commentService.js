import request from "../utils/request";

const baseUrl = 'http://localhost:3030/jsonstore/comments';

export default {
    create(email, tripId, comment) {
        return request.post(baseUrl, { email, tripId, comment });
    }
};