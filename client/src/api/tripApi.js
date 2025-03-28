import { useEffect, useState } from "react";
import request from "../utils/request";
import useAuth from "../hooks/useAuth";

const baseUrl = `http://localhost:3030/data/trips`;

export const useTrips = () => {
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        request.get(baseUrl)
            .then(setTrips)
    }, []);

    return { trips };
};

export const useTrip = (tripId) => {
    const [trip, setTrip] = useState({});

    useEffect(() => {
        request.get(`${baseUrl}/${tripId}`)
            .then(setTrip);
    }, [tripId])

    return {
        trip,
    };
};

export const useLatestTrips = () => {
    const [latestTrips, setLatestTrips] = useState([]);

    useEffect(() => {
        const searchParams = new URLSearchParams({
            sortBy: '_createdOn desc',
            pageSize: 3,
            select: '_id,imageUrl,title',
        });

        request.get(`${baseUrl}?${searchParams.toString()}`)
            .then(setLatestTrips)
    }, []);

    return { latestTrips };
};

export const useCreateTrip = () => {
    const { request } = useAuth();

    const create = (tripData) =>
        request.post(baseUrl, tripData);

    return {
        create,
    }
};

export const useEditTrip = () => {
    const { request } = useAuth();

    const edit = (tripId, tripData) =>
        request.put(`${baseUrl}/${tripId}`, { ...tripData, _id: tripId });

    return {
        edit,
    }
};

export const useDeleteTrip = () => {
    const { request } = useAuth();

    const deleteTrip = (tripId) =>
        request.delete(`${baseUrl}/${tripId}`);

    return {
        deleteTrip,
    }
};