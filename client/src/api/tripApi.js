import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth"; // Use useAuth for authenticated requests

const baseUrl = `http://localhost:3030/data/trips`;

export const useTrips = () => {
    const { request } = useAuth(); // Use request from useAuth hook
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        request.get(baseUrl)
            .then(setTrips)
            .catch(error => console.error("Error fetching trips:", error)); // Error handling
    }, [request]);

    return { trips };
};

export const useTrip = (tripId) => {
    const { request } = useAuth(); // Use request from useAuth hook
    const [trip, setTrip] = useState({});

    useEffect(() => {
        request.get(`${baseUrl}/${tripId}`)
            .then(setTrip)
            .catch(error => console.error("Error fetching trip:", error)); // Error handling
    }, [tripId, request]);

    return { trip };
};

export const useLatestTrips = () => {
    const { request } = useAuth(); // Use request from useAuth hook
    const [latestTrips, setLatestTrips] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLatestTrips = async () => {
            try {
                const searchParams = new URLSearchParams({
                    sortBy: '_createdOn desc',
                    pageSize: 3,
                    select: '_id,imageUrl,title,members',
                });

                const response = await request.get(`${baseUrl}?${searchParams.toString()}`);
                setLatestTrips(response);
            } catch (error) {
                setError("Failed to fetch latest trips.");
                console.error("Error fetching latest trips:", error);
            }
        };

        fetchLatestTrips();
    }, [request]);

    return { latestTrips, error };
};

export const useCreateTrip = () => {
    const { request } = useAuth(); // Use request from useAuth hook

    const create = (tripData) =>
        request.post(baseUrl, tripData)
            .catch(error => console.error("Error creating trip:", error)); // Error handling

    return { create };
};

export const useEditTrip = () => {
    const { request } = useAuth(); // Use request from useAuth hook

    const edit = (tripId, tripData) =>
        request.put(`${baseUrl}/${tripId}`, { ...tripData, _id: tripId })
            .catch(error => console.error("Error editing trip:", error)); // Error handling

    return { edit };
};

export const useDeleteTrip = () => {
    const { request } = useAuth(); // Use request from useAuth hook

    const deleteTrip = (tripId) =>
        request.delete(`${baseUrl}/${tripId}`)
            .catch(error => console.error("Error deleting trip:", error)); // Error handling

    return { deleteTrip };
};
