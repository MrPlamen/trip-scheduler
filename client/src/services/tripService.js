import request from "../utils/request";

const baseUrl = 'http://localhost:3030/jsonstore/trips';

export default {
    async getAll() {
        const result = await request.get(baseUrl);

        const trips = Object.values(result);

        return trips;
    },
    getOne(tripId) {
        return request.get(`${baseUrl}/${tripId}`);
    },
    create(tripData) {
        return request.post(baseUrl, tripData);
    },
    delete(tripId) {
        return request.delete(`${baseUrl}/${tripId}`);
    }
};