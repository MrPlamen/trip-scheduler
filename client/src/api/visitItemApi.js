import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import request from "../utils/request";

const baseUrl = `http://localhost:3030/jsonstore/visitItems`;

export const useEditItem = () => {
    const { request } = useAuth();

    const edit = (visitItemId, visitItemData) =>
        request.put(`${baseUrl}/${visitItemId}`, { ...visitItemData, _id: visitItemId });

    return {
        edit,
    }
};

export const useDeleteItem = () => {
    const { request } = useAuth();

    const deleteItem = (visitItemId) =>
        request.delete(`${baseUrl}/${visitItemId}`);

    return {
        deleteItem,
    }
};

export const useVisitItems = () => {
    const [visitItems, setVisitItems] = useState([]);

    useEffect(() => {
        request.get(baseUrl)
            .then(setVisitItems)
    }, []);

    return { visitItems };
};

export const useVisitItem = (visitItemId) => {
    const [visitItem, setVisitItem] = useState({});

    const fetchVisitItem = async () => {
        try {
            const fetchedVisitItem = await request.get(`${baseUrl}/${visitItemId}`);
            setVisitItem(fetchedVisitItem);
        } catch (error) {
            console.error('Error fetching visit item:', error);
        }
    };

    useEffect(() => {
        fetchVisitItem();
    }, [visitItemId]);

    return {
        visitItem,
        refetchVisitItem: fetchVisitItem // Add refetch function
    };
};
