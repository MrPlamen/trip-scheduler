import { useEffect, useState } from "react";
import request from "../utils/request";
import useAuth from "../hooks/useAuth";

const baseUrl = `http://localhost:3030/jsonstore/visitItems`;

export const useDeleteItem = () => {
    const { request } = useAuth();

    const deleteItem = (visitItemId) =>
        request.delete(`${baseUrl}/${visitItemId}`);

    return {
        deleteItem,
    }
};