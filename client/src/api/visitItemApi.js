import { useEffect, useState } from "react";
import request from "../utils/request";
import useAuth from "../hooks/useAuth";

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